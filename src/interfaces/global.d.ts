declare global {
    interface Error {
        public status?: number;
        public message: string;
        constructor(message?: string);
    }
}

// Adding this exports the declaration file which Typescript/CRA can now pickup:
export default {};