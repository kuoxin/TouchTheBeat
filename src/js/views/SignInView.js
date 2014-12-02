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
        default_texts: {
            signin_password: 'This email/password combination does not exist.',
            signup_email: 'This e-mail address is invalid.',
            signup_username: 'This username is already taken.',
            signup_password_repeat: 'These passwords do not match.'
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
            var form = $('#form_signup');
            if (this.validateForm(form)) {
                var data = this.getFormData(form);
                if (data.password != data.password_repeat) {
                    self.markValid(false, 'signup_password');
                    self.markValid(false, 'signup_password_repeat');
                    return false;
                }

                var user = new User();
                data.password = md5.MD5(data.password).toString();
                user.save(_.pick(data, 'username', 'email', 'password', 'homepage'), {
                    success: function () {
                        console.log('signup succeeded');
                        app.session.login(_.pick(data, 'email', 'password'));
                    },
                    error: function (user, e) {
                        console.log('error catched');
                        switch (e) {
                            case 'USER_EMAIL_NOT_VALID':
                                self.markValid(false, 'signup_email', 'This email address does not exist.');
                                break;
                            case 'USER_EMAIL_ALREADY_EXISTS':
                                self.markValid(false, 'signup_email', 'An account with this email address does already exist.');
                                break;
                            case 'USER_NAME_ALREADY_EXISTS':
                                self.markValid(false, 'signup_username', 'This username is already taken.');
                                break;
                            default:
                                console.error('unhandled error from backend');
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

            if (!this.validateForm(form))
                return;

            var data = this.getFormData(form);
            data.password = md5.MD5(data.password).toString();

            app.session.login(data, {
                error: function (session, e) {
                    switch (e) {
                        case 'SIGNIN_USER_NOT_FOUND':
                        case 'SIGNIN_CREDENTIALS_INCORRECT':
                            self.markValid(false, 'signin_email');
                            self.markValid(false, 'signin_password');
                            break;
                        default:
                            console.error('unhandled error from backend: ' + e);
                    }
                }
            });
            return false;
        },


        // could be extracted
        markValid: function (valid, name, text) {
            var elem = this.$('input#' + name);
            var formgroup = elem.closest('.form-group');
            formgroup.removeClass(valid ? 'has-error' : 'has-success');
            if (!valid)
                formgroup.addClass('has-error');
            var help_block = elem.siblings('.help-block').first();
            if (help_block) {
                help_block[!valid ? 'show' : 'hide']();
                help_block.html(text || this.default_texts[name]);
            }
        },

        // could be extracted
        validateForm: function (form) {
            var valid = true;
            var self = this;
            form.find("input").each(function () {
                var elem_valid = this.checkValidity();
                self.markValid(elem_valid, $(this).attr('id'));
                valid = valid && elem_valid;
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