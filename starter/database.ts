import { Collection, MongoClient, SortDirection } from "mongodb";
import dotenv from "dotenv";
import { Penguin, Researcher, Species } from "./types";
import bcrypt from 'bcrypt';
dotenv.config();

export const client = new MongoClient(process.env.CONNECTION_STRING || "mongodb://localhost:27017");
export const researchersCollection : Collection<Researcher> = client.db("InhaalEx").collection<Researcher>("researchers");
export const speciesCollection : Collection<Species> = client.db("InhaalEx").collection<Species>("species");
export const penguinsCollection : Collection<Penguin> = client.db("InhaalEx").collection<Penguin>("penguins")
export const SALT_ROUNDS = 10;

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function getAllResearchers(): Promise<Researcher[]> {
    return await researchersCollection.find({}).toArray();
}

export async function getAllSpecies(): Promise<Species[]> {
    return await speciesCollection.find({}).toArray();
}

export async function getSpeciesById(id: string): Promise<Species | null> {
    let result : Species | any = await client.db("InhaalEx").collection("species").findOne<Species>({id: id});
    return result;
}

export async function updateResearcher(username: string, newPincode: string): Promise<void> {
    
}

export async function assignPenguinToResearcher(penguinId: number, researcherString: string): Promise<void> {  
    
};

export async function getAllPenguins(sortField: string, sortDirection: SortDirection, q: string): Promise<Penguin[]> {
    const filther = q ? {name: {$regex : q, $options: "i" }}: {};
    const sort:Record<string, SortDirection> = {[sortField]: sortDirection}
    return await penguinsCollection.find(filther).sort(sort).toArray();
}

export async function getPenguinsBySpecies(id: number): Promise<Penguin[]> {
    let result : Penguin | null = await client.db("InhaalEx").collection("penguins").findOne<Penguin>({id: id});
    return await penguinsCollection.find({species_id: result?.species_id}).toArray();
}

export async function login(username: string, pincode: string): Promise<Researcher | null> {
    return null;
}

async function seedResearchers(): Promise<void> {
    const researchers : Researcher[] = await getAllResearchers();
        if (researchers.length == 0) {
        console.log("Database is empty, loading researchers from API")
        const response = await fetch("https://raw.githubusercontent.com/similonap/json/refs/heads/master/penguins/researchers.json");
        const researchers : Researcher[] = await response.json();
        
        for (const r of researchers) {
            r.pincode = await bcrypt.hash(r.pincode, SALT_ROUNDS);
        }

        await researchersCollection.insertMany(researchers);
        console.log(`Seeded ${researchers.length} researchers`)
        } else {
            console.log("database already contains researchers")
        }
    
    
}

async function seedSpecies(): Promise<void> {
    const species : Species[] = await getAllSpecies();
        if (species.length == 0) {
        console.log("Database is empty, loading species from API")
        const response = await fetch("https://raw.githubusercontent.com/similonap/json/refs/heads/master/penguins/species.json");
        const species : Species[] = await response.json();
        
        await speciesCollection.insertMany(species);
        console.log(`Seeded ${species.length} species`)
        } else {
            console.log("database already contains species")
        }

}

async function seedPenguins(): Promise<void> {
    const penguins = await penguinsCollection.find({}).toArray();

    if (penguins.length == 0) {
        console.log("No Pengus, Loading from API")
        const response = await fetch("https://raw.githubusercontent.com/similonap/json/refs/heads/master/penguins/penguins.json")
        const penguins : Penguin[] = await response.json();
        const species = await getAllSpecies();

        for (const pengu of penguins) {
            let result : Species | any = await client.db("InhaalEx").collection<Species>("species").findOne<Species>({id: pengu.species_id});
            console.log(result)
            pengu.species = result;
        }
        await penguinsCollection.insertMany(penguins);
        console.log(`Seeded ${penguins.length} penguins`)
    } else {
        console.log("penguins alr in database")
    }
    
}

export async function seedDatabase() {
    await seedResearchers();
    await seedSpecies();
    await seedPenguins();
}

export async function connect() {
    await client.connect();
    await seedDatabase();
    console.log("Connected to database");
    process.on("SIGINT", exit);
}