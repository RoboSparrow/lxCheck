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
        setAuth: function(store){console.log(this);
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
            this.lrs = data.lrs;
            if(!data.hasOwnProperty('user')){
                return false;
            }
            this.user = data.user;
            if(!data.hasOwnProperty('pass')){
                return false;
            }
            this.pass = data.pass;
            if(!data.hasOwnProperty('version')){
                return false;
            }
            this.version = data.version;

            this.setAuth(false);
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
        authForm: authForm
    };


})(window, mocha, chai, req);
