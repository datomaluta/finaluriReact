/**
 * Fetchs questions for quiz
 * @return <Promise {Object}>
 */
export async function getQuestions() {
    const url = 'http://my-json-server.typicode.com/DanielBarbakadze/Advanced-JS-and-React-Basics/db';
    try {
        const res = await fetch(url);
        return res.json();
    } catch (e) {
        console.log(e);
        return false;
    }
}
