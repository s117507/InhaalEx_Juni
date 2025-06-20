import { Collection, MongoClient, SortDirection } from "mongodb";
import dotenv from "dotenv";
import { Penguin, Researcher, Species } from "./types";
import bcrypt from 'bcrypt';
dotenv.config();

export const client = new MongoClient(process.env.CONNECTION_STRING || "mongodb://localhost:27017");
export const researchersCollection : Collection<Researcher> = client.db("InhaalEx").collection<Researcher>("researchers");

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
    return [];
}

export async function getSpeciesById(id: string): Promise<Species | null> {
    return null;
}

export async function updateResearcher(username: string, newPincode: string): Promise<void> {
    
}

export async function assignPenguinToResearcher(penguinId: number, researcherString: string): Promise<void> {  
    
};

export async function getAllPenguins(sortField: string, sortDirection: SortDirection, q: string): Promise<Penguin[]> {
    return [];
}

export async function getPenguinsBySpecies(id: number): Promise<Penguin[]> {
    return [];
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
            r.pincode = await bcrypt.hash(r.pincode, SALT_ROUNDS)
        }

        await researchersCollection.insertMany(researchers);
        } 
    console.log(`Seeded ${researchers.length} researchers`)
}

async function seedSpecies(): Promise<void> {
   
}

async function seedPenguins(): Promise<void> {
    
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