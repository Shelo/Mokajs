Moka.Factory.anyStatic('H1', 'h1');
Moka.Factory.input('Input');
Moka.Factory.checkbox('Checkbox');


Moka.Cache.define('ToDo', {
    tasks: [
        'Hello',
        'Hello 2'
    ],
    addTaskInput: Moka.Instantiate('Input', {placeholder: 'type in a task'})
}, function () {

    return {
        children: [
            Moka.Instantiate('H1', {children: 'Todo Application'}),
            this.addTaskInput,
            Moka.Instantiate('TaskList', {tasks: this.tasks})
        ]
    }
});


Moka.Cache.define('TaskList', {
    tasks: []
}, function () {
    var taskInstances = [];

    for (var i = 0; i < this.tasks.length; i++) {
        taskInstances.push(Moka.Instantiate('Task', {
            name: this.tasks[i]
        }));
    }

    return {
        children: taskInstances
    }
});


Moka.Cache.define('Task', {
    checked: false,
    name: '',
    checkbox: Moka.Instantiate('Checkbox', {checked: this.checked}),

    isChecked: function () {
        return this.checkbox.checked;
    }
}, function () {
    return {
        children: [
            this.checkbox,
            this.name
        ]
    }
});
