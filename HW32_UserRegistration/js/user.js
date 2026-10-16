//user.js

function createUser({ name, age, ...rest }) {
  
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('Name is required');
    }

    if (age === '' || age === undefined || age === null) {
        throw new Error('Age is required');
    }

    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 120 || !Number.isInteger(ageNumber)) {
        throw new Error('Invalid age');
    }

    const id = crypto.randomUUID();
    
    return {
        id,
        name: name.trim(),
        age: ageNumber,
        ...rest
    };
}