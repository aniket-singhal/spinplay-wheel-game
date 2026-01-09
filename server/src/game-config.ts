export interface WheelSegment {
    id: number;
    credits: number;
    weight: number;
}

export const SEGMENTS: WheelSegment[] = [
    { id: 0, credits: 5000, weight: 4 },
    { id: 1, credits: 200,  weight: 100 },
    { id: 2, credits: 1000, weight: 20 },
    { id: 3, credits: 400,  weight: 50 },
    { id: 4, credits: 2000, weight: 10 },
    { id: 5, credits: 200,  weight: 100 },
    { id: 6, credits: 1000, weight: 20 },
    { id: 7, credits: 400,  weight: 50 }
];