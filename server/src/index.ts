import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- 1. CONFIGURATION ---
interface WheelSegment {
    id: number;
    credits: number;
    weight: number;
}

const SEGMENTS: WheelSegment[] = [
    { id: 0, credits: 5000, weight: 4 },
    { id: 1, credits: 200,  weight: 100 },
    { id: 2, credits: 1000, weight: 20 },
    { id: 3, credits: 400,  weight: 50 },
    { id: 4, credits: 2000, weight: 10 },
    { id: 5, credits: 200,  weight: 100 },
    { id: 6, credits: 1000, weight: 20 },
    { id: 7, credits: 400,  weight: 50 }
];

// Calculate total weight (should be 354 based on the table)
const TOTAL_WEIGHT = SEGMENTS.reduce((sum, seg) => sum + seg.weight, 0);

// --- 2. LOGIC ---
const getWeightedResult = (): WheelSegment => {
    let random = Math.random() * TOTAL_WEIGHT;
    
    for (const segment of SEGMENTS) {
        if (random < segment.weight) {
            return segment;
        }
        random -= segment.weight;
    }
    return SEGMENTS[0]; // Fallback should technically never happen
};

// --- 3. ENDPOINTS ---
app.post('/spin', (req: Request, res: Response): any => { 
    // Debug Control: Allow forcing a specific result 
    const { debugForceIndex } = req.body;

    let result: WheelSegment;

    if (typeof debugForceIndex === 'number' && debugForceIndex >= 0 && debugForceIndex < 8) {
        console.log(`[DEBUG] Forcing stop at index: ${debugForceIndex}`);
        result = SEGMENTS[debugForceIndex];
    } else {
        console.log(`[SERVER] Random Spin`);
        result = getWeightedResult();
    }
    console.log(`index: ${result.id}`);
    console.log(`credits: ${result.credits}`);
    
    // Return the result to the client
    return res.json({
        stopIndex: result.id,
        creditsWon: result.credits
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});