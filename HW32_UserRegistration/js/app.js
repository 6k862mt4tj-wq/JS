// app.js

try {
    const userManager = createUserManager();
    const form = document.querySelector('#registrationForm');
    const nameInput = document.querySelector('#nameInput');
    const ageInput = document.querySelector('#ageInput');
    const userListContainer = document.querySelector('#userList');
    const message = document.querySelector('#message'); 

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        try {
            const name = nameInput.value.trim();
            const age = ageInput.value.trim();
            const user = createUser({ name: name, age: age });

            let role;
            if (user.age >= 0 && user.age <= 13) {
                role = 'child';
            } else if (user.age > 13 && user.age <= 19) {
                role = 'teenager';
            } else if (user.age > 19 && user.age <= 64) {
                role = 'adult';
            } else {
                role = 'senior';
            }
            user.role = role;
            
            userManager.addUser(user);

            const users = userManager.getUsers();
            updateUserList(users);
            
            console.log('User registered successfully:', user);
            
            message.textContent = 'User successfully registered!';
            message.className = 'success-msg';

            nameInput.value = '';
            ageInput.value = '';
            nameInput.focus();
            
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