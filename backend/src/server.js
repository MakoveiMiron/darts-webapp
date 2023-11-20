import initDb from "./database/init";
import app from './app'
import { PORT } from "./constants";

initDb();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});