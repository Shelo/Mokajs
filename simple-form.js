Moka.Factory.anyStatic('H1', 'h1');
Moka.Factory.input('Input');
Moka.Factory.button('Button');

/**
 * A simple form that asks the user for information and then logs
 * it to the console.
 */
Moka.Cache.define('Form', {
    title: 'Fill in your information',
    fullName: '',
    email: '',
    password: '',

    onSend: function (e) {
        e.preventDefault();

        console.log(this.fullName.value);
        console.log(this.email.value);
        console.log(this.password.value);
    }
}, function () {
    this.fullName = Moka.Instantiate('LabelInput', {
        label: 'Full name',
        value: this.fullName
    });

    this.email = Moka.Instantiate('LabelInput', {
        label: 'Email',
        value: this.email
    });

    this.password = Moka.Instantiate('LabelInput', {
        label: 'Password',
        value: this.password, type: 'password'
    });

    return {
        inherits: 'form',
        children: [
            Moka.Instantiate('H1', {children: this.title}),
            this.fullName,
            this.email,
            this.password,
            Moka.Instantiate('Button', {text: 'Send', className: 'button', onClick: this.onSend.bind(this)})
        ]
    }
});


/**
 * Component that places a label with an input and saves the current
 * status of the input value.
 */
Moka.Cache.define('LabelInput', {
    label: 'LabelInput',

    onInput: function (e) {
        this.value = e.target.value;
    }
}, function () {
    return {
        inherits: 'label',
        children: [
            this.label,
            Moka.Instantiate('Input', {
                placeholder: this.placeholder,
                type: this.type,
                onInput: this.onInput.bind(this),
                value: this.value
            })
        ]
    }
});
