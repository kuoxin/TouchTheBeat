define([
	'jquery',
	'underscore',
	'Framework',
	'text!templates/signin.html',
	'app',
	'models/User',
	'md5'
], function ($, _, Framework, plaintemplate, app, User, md5) {
	var SignInView = Framework.View.extend({
		defaultTexts: {
			SIGNIN_PASSWORD: 'This email/password combination does not exist.',
			SIGNUP_EMAIL: 'This e-mail address is invalid.',
			SIGNUP_USERNAME: 'This username is already taken.',
			SIGNUP_PASSWORD_REPEAT: 'These passwords do not match.'
		},

		render: function () {
			var self = this;
			this.$el.html(_.template(plaintemplate, {}));


			this.$('#user_modal').on('shown.bs.modal', function () {
				"use strict";
				// show signin form as default tab
				self.$('#link_signin').tab('show');

				// focus manually to avoid a fade in animation when the modal has ended fading in
				self.$('#signin_email').focus();

			});

			this.listenTo(app.session, 'change:logged_in', function () {
				// close modal when the user was signed in successfully
				$('#user_modal').modal('hide');
			});
			this.$('#user_modal').on('hidden.bs.modal', function () {
				//delete the view when the modal was closed
				self.remove();
			});

			// auto focus first input on tab change
			this.$('#link_signin').on('shown.bs.tab', function (el) {
				"use strict";
				// substr(5): remove 'link_' from id
				self.$('#form_' + el.target.id.substr(5)).find('input:first').focus();
			});

			// show modal
			this.$('#user_modal').modal('show');


		},

		events: {
			'click #btn_signup': 'onSignUpBtnClick',
			'click #btn_signin': 'onSignInBtnClick',
			'click #closebutton': 'closeModal'
		},

		onSignUpBtnClick: function (evt) {
			evt.preventDefault();
			var self = this;
			var valid = true;

			var captchaIsValid = this.$('#g-recaptcha-response').val() !== '';
			self.markValid(captchaIsValid, 'signup_recaptcha', 'Please confirm that you are no robot.');

			valid = valid && captchaIsValid;

			var form = $('#form_signup');
			if (this.validateForm(form)) {
				var data = this.getFormData(form);

				if (data.password !== data.password_repeat) {
					self.markValid(false, 'signup_password');
					self.markValid(false, 'signup_password_repeat');
					valid = false;
				}

				if (!valid) {
					return false;
				}

				var user = new User();
				data.password = md5.MD5(data.password).toString();
				user.save(_.pick(data, 'username', 'email', 'password', 'homepage', 'g-recaptcha-response'), {
					success: function () {
						console.log('signup succeeded');
						app.session.login(_.pick(data, 'email', 'password'));
					},
					error: function (user, e) {
						switch (e.errorCode) {
							case 'USER_EMAIL_NOT_VALID':
								self.markValid(false, 'signup_email', 'This email address does not exist.');
								break;
							case 'USER_EMAIL_ALREADY_EXISTS':
								self.markValid(false, 'signup_email', 'An account with this email address does already exist.');
								break;
							case 'USER_NAME_ALREADY_EXISTS':
								self.markValid(false, 'signup_username', 'This username is already taken.');
								break;
							case 'USER_CAPTCHA_FAILED':
							case 'USER_CAPTCHA_ERROR':
								self.markValid(false, 'signup_recaptcha', 'There was an error when checking that you are no robot. Please try again after restarting TouchTheBeat.');
								break;
							default:
								console.error('unhandled error from backend');
								console.log(e);
						}
					}
				});
			}

			return false;
		},

		onSignInBtnClick: function (evt) {
			evt.preventDefault();
			var self = this;
			var form = $('#form_signin');

			if (!this.validateForm(form)) {
				return;
			}


			var data = this.getFormData(form);
			data.password = md5.MD5(data.password).toString();

			app.session.login(data, {
				error: function (session, error) {
					switch (error.errorCode) {
						case 'SIGNIN_USER_NOT_FOUND':
						case 'SIGNIN_CREDENTIALS_INCORRECT':
							self.markValid(false, 'signin_email');
							self.markValid(false, 'signin_password', 'There exists no account with the credentials you entered.');
							error.handled = true;
							break;
					}
				}
			});
			return false;
		},


		// could be extracted
		markValid: function (valid, name, text) {
			var elem = this.$('#' + name);
			var formgroup = elem.closest('.form-group');
			formgroup.removeClass(valid ? 'has-error' : 'has-success');
			if (!valid) {
				formgroup.addClass('has-error');
			}
			var helpBlock = elem.siblings('.help-block').first();
			if (helpBlock) {
				helpBlock[!valid ? 'show' : 'hide']();
				helpBlock.html(text || this.defaultTexts[name]);
			}
		},

		// could be extracted
		validateForm: function (form) {
			var valid = true;
			var self = this;
			form.find("input").each(function () {
				var elemValid = this.checkValidity();
				self.markValid(elemValid, $(this).attr('id'));
				valid = valid && elemValid;
			});
			return valid;
		},

		// could be extracted
		getFormData: function (form) {
			var o = {};
			var a = form.serializeArray();
			$.each(a, function () {
				if (o[this.name] !== undefined) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		},

		closeModal: function () {
			$('#user_modal').modal('hide');
		}
	});
	return SignInView;
});
