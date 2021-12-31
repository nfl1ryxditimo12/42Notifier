declare module "eventType" {
    interface eventType {
        id: number;
        name: string;
        description: string;
        location: string;
        max_people: number;
        begin_at: Date;
        end_at: Date;
        created_at: Date;
        themes: Array<{
            id: number;
            name: string;
            created_at: Date;
            updated_at: Date;
        }>;
        cursus: Array<{
            id: number;
            created_at: Date;
            name: string;
            slug: string;
        }>;
    }
}
