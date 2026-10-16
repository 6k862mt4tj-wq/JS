// app.js

try {
    const userManager = createUserManager();
    const registerButton = document.querySelector('#submit');
    const nameInput = document.querySelector('#nameInput');
    const ageInput = document.querySelector('#ageInput');
    const userListContainer = document.querySelector('#userList');
    const message = document.querySelector('#message'); 

    registerButton.addEventListener('click', (event) => {
        event.preventDefault(); 
        
        try {
            const name = nameInput.value.trim();
            const age = ageInput.value.trim();

            if (age === '') {
                throw new Error('Age is required');
            } else if (isNaN(Number(age))) {
                throw new Error('Age must be a number');
            }
            const ageNum = Number(age);

            let role;
            if (ageNum >= 0 && ageNum <= 13) {
                role = 'child';
            } else if (ageNum > 13 && ageNum <= 19) {
                role = 'teenager';
            } else if (ageNum > 19 && ageNum <= 64) {
                role = 'adult';
            } else {
                role = 'senior';
            }

            const user = createUser({ name: name, age: ageNum, role: role });
            
            userManager.addUser(user);

            const users = userManager.getUsers();
            updateUserList(users);
            
            console.log('User registered successfully:', user);
            
            message.textContent = 'User successfully registered!';
            message.className = 'success-msg';

            nameInput.value = '';
            ageInput.value = '';
            focusInput(nameInput);
            
        } catch (error) {
            console.error('Error during registration:', error.message);
            
            message.textContent = `Error: ${error.message}`;
            message.className = 'error-msg';
            
        } finally {
            console.log('Registration attempt completed');
        }
    });

    function updateUserList(users) {
        userListContainer.replaceChildren();

        users.forEach(({ name, age, ...rest }) => {
            const userItem = document.createElement('li');
            
            userItem.textContent = `${name}, ${age} years old, ${rest.role}`; 
            userListContainer.append(userItem);
        });
    }
} catch (error) {
    console.error('Error initializing the application:', error.message);
}