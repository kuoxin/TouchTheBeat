# This fork of SweetAlert for Bootstrap
This fork of SweetAlert for Bootstrap does not add the contents of lib/sweet-alert.html to the DOM automatically.
Instead you will need to insert the required html code into your project by yourself.
The advantage here is that you can decide where and when to add it to the DOM,
which might be important if you develop a single-page-javascript application.
Additionally, this fork allows html content to set as alert content.

----------------------

> If you are looking for the non-Bootstrap version refer to the original
> [SweetAlert project](https://github.com/t4t5/sweetalert).

# SweetAlert for Bootstrap

An awesome _replacement_ for JavaScript's `alert()` made for Bootstrap.


## Usage

On how to use these alerts, read the docs from the original
[SweetAlert](http://tristanedwards.me/sweetalert) project.

The main difference here is that instead of using the `confirmButtonColor` you
should use the `confirmButtonClass`. It can take any of the default Bootstrap
classes for buttons like: `btn-danger`, `btn-success`, etc. The rest of the API
remains exactly the same.

Also if you are using Less in your project, then instead of including the
`*.css` files include the
[`sweet-alert.less`](https://github.com/lipis/bootstrap-sweetalert/blob/master/lib/sweet-alert.less)
in your building process. That way it will use the Bootstrap's variables to
match your theme perfectly.


## Development

```shell
$ npm install
$ grunt
```
