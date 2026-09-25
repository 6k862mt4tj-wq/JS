export async function readFromJsonFile(filePath) {
    const response = await fetch(filePath)
    if(!response.ok){
        throw new Error("File not found");
    }
    return response.json()

}
