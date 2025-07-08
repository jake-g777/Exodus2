import { Server } from 'socket.io';
import { logger } from '../utils/logger';
import { WebSocketMessage, TradeUpdate, PriceUpdate } from '../types';

export function setupWebSocket(io: Server): void {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join trading room
    socket.on('join-trading', () => {
      socket.join('trading');
      logger.info(`Client ${socket.id} joined trading room`);
    });

    // Join analytics room
    socket.on('join-analytics', () => {
      socket.join('analytics');
      logger.info(`Client ${socket.id} joined analytics room`);
    });

    // Handle trade updates
    socket.on('trade-update', (data: TradeUpdate) => {
      const message: WebSocketMessage = {
        type: 'trade-update',
        data,
        timestamp: new Date()
      };
      
      io.to('trading').emit('trade-update', message);
      logger.info(`Trade update broadcasted: ${data.tradeId}`);
    });

    // Handle price updates
    socket.on('price-update', (data: PriceUpdate) => {
      const message: WebSocketMessage = {
        type: 'price-update',
        data,
        timestamp: new Date()
      };
      
      io.to('analytics').emit('price-update', message);
      logger.info(`Price update broadcasted: ${data.commodity}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  // Broadcast periodic updates
  setInterval(() => {
    // Simulate price updates
    const commodities = ['crude_oil', 'natural_gas', 'electricity', 'coal', 'renewables'];
    const randomCommodity = commodities[Math.floor(Math.random() * commodities.length)];
    const randomPrice = Math.random() * 100 + 50; // Random price between 50-150

    const priceUpdate: PriceUpdate = {
      commodity: randomCommodity as any,
      price: randomPrice,
      timestamp: new Date()
    };

    const message: WebSocketMessage = {
      type: 'price-update',
      data: priceUpdate,
      timestamp: new Date()
    };

    io.to('analytics').emit('price-update', message);
  }, 5000); // Update every 5 seconds

  logger.info('WebSocket setup completed');
} 