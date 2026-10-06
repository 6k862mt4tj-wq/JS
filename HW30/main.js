import axios from "axios"; 

async function returnUsers() {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        return response.data;
    } catch (error) {
        console.error("Ошибка API:", error.message);
        return []; 
    }
}

function validateUser(user) {
    if (!user.name || !user.email) {
        throw new Error("User must have a name and an email.");
    }
    if (!user.email.includes("@")) {
        throw new Error("Invalid email format.");
    }
    if (user.id && typeof user.id !== "number") {
        throw new Error("User ID must be a number.");
    }
    return true;
}

async function main() {
    const users = await returnUsers();

    if (!users || users.length === 0) {
        console.log("No users returned from the API.");
        return;
    }

    for (const user of users) {
        try {
            validateUser(user);
            console.log(`Valid user: ${user.name} (${user.email})`);
        } catch (error) {
            console.error(`Invalid user data: ${error.message}`);
        }
    }
}

main();