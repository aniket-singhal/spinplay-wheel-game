import express, { Request, Response } from 'express';
import cors from 'cors';
import { SEGMENTS, WheelSegment } from './game-config';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Calculate total weight (should be 354 based on the table)
const TOTAL_WEIGHT = SEGMENTS.reduce((sum, seg) => sum + seg.weight, 0);

const getWeightedResult = (): WheelSegment => {
    let random = Math.random() * TOTAL_WEIGHT;
    
    for (const segment of SEGMENTS) {
        if (random < segment.weight) {
            return segment;
        }
        random -= segment.weight;
    }
    return SEGMENTS[0];
};

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
    
    return res.json({
        stopIndex: result.id,
        creditsWon: result.credits
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});