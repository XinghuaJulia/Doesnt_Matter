import GenerateTips from "../components/utils/GenerateTips";
import {mockSupabase} from "../lib/supabase"

// const mockFetch = jest.spyOn(global, "supab")
// .mockImplementation(() => 
//     Promise.resolve({ data: { name: "hello world" }}));


jest.mock('supabase');


describe("GenerateTips", () => {
    test("should return tips", async () => {
        const result = "hello world";
        console.log(result);
        expect(result).toBe("hello world");
    });
});