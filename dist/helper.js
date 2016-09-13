/* global req */
(function(window, mocha, chai, req){
    'use strict';

    window.assert = chai.assert;
    mocha.setup('bdd');

    var LRS = {
        lrs: null,
        version: null,
        user: null,
        pass: null,
        setAuth: function(store){
            store = store || false;
            //lrs auth
            req.xapi.LRS = this.lrs;
            req.xapi.AUTH = 'Basic ' + window.btoa(this.user + ':' + this.pass);
            req.xapi.VERSION = this.version;

            if(store){
                window.localStorage.setItem('lrs', JSON.stringify(this));
            }
        },
        getAuth: function(){
            var json = window.localStorage.getItem('lrs');

            var data = JSON.parse(json);
            if(!data){
                return false;
            }
            if(!data.hasOwnProperty('lrs')){
                return false;
            }
            LRS.lrs = data.lrs;
            if(!data.hasOwnProperty('user')){
                return false;
            }
            LRS.user = data.user;
            if(!data.hasOwnProperty('pass')){
                return false;
            }
            LRS.pass = data.pass;
            if(!data.hasOwnProperty('version')){
                return false;
            }
            LRS.version = data.version;

            LRS.setAuth(false);
            return true;
        }
    };

    var Form = {

        getAuth: function(form){
            var hasAuth = LRS.getAuth();
            if(hasAuth){
                form.querySelector('[name=lrs]').value = LRS.lrs;
                form.querySelector('[name=user]').value = LRS.user;
                form.querySelector('[name=pass]').value = LRS.pass;
                form.querySelector('[name=version]').value = LRS.version;
                return true;
            }
            return false;
        },

        setAuth:function(form){
            LRS.lrs = form.querySelector('[name=lrs]').value;
            LRS.user = form.querySelector('[name=user]').value;
            LRS.pass = form.querySelector('[name=pass]').value;
            LRS.version = form.querySelector('[name=version]').value;
            LRS.setAuth(true);
        },

        validate: function(form){
            var el;
            var errors = 0;

            el = form.querySelector('[name=lrs]');
            var check = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(el.value);
            if(check){
                el.value.replace(/\/$/, '');//trailing slash
            }
            errors += parseInt((!check), 10);
            el.style.backgroundColor = (!check) ? 'red' : 'transparent';

            el = form.querySelector('[name=user]');
            errors += parseInt((!el.value.length), 10);
            el.style.backgroundColor = (!el.value.length) ? 'red' : 'transparent';

            el = form.querySelector('[name=pass]');
            errors += parseInt((!el.value.length), 10);
            el.style.backgroundColor = (!el.value.length) ? 'red' : 'transparent';

            return errors;
        }

    };

    var authForm = function(done){

        var form = document.getElementById('BasicAuth');

        if(Form.getAuth(form)){
            done();
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            var errors = Form.validate(this);

            if(!errors){
                Form.setAuth(this);
                this.submit();
            }

        }, false);

    };


    window.Helper = {
        authForm: authForm,
        getAuth: LRS.getAuth
    };


})(window, mocha, chai, req);
