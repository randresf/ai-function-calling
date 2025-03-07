import type { Request, Response } from 'express';
import { z } from 'zod';
import { FeedbackSchema } from '../tools/feedback';

export default function FeedbackRoute() {
  return async (req: Request, res: Response) => {
    try {
      const feedback = FeedbackSchema.parse(req.body);
      console.log('Received feedback:', feedback);
      res.json({ status: 'success' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal Server Error'
      });
    }
  }
}