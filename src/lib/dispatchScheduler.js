/**
 * Dispatch Scheduler
 * Calculates packing and dispatch schedule for final product
 */

import { format, addHours } from 'date-fns';

/**
 * Generate dispatch schedule based on final stage production
 * @param {Array} finalStageBatches - Batches from the final production stage
 * @param {number} dispatchBatchQuantity - Quantity per dispatch batch (kg)
 * @param {number} packingTime - Time required to pack a dispatch batch (hours)
 * @returns {Object} Dispatch schedule with batches
 */
export function scheduleDispatches(finalStageBatches, dispatchBatchQuantity, packingTime) {
  if (!finalStageBatches || finalStageBatches.length === 0) {
    return { dispatches: [], totalDispatched: 0, totalBatches: 0 };
  }

  const dispatches = [];
  let cumulativeDispatched = 0;
  let accumulatedProduct = 0;
  let dispatchBatchNumber = 1;
  let productionQueue = [];

  // Build queue of when product becomes available (after packing)
  finalStageBatches.forEach(batch => {
    productionQueue.push({
      availableTime: batch.packTime, // Product available after packing
      quantity: batch.outputQuantity,
    });
  });

  // Sort by available time
  productionQueue.sort((a, b) => a.availableTime - b.availableTime);

  let currentIndex = 0;

  while (currentIndex < productionQueue.length || accumulatedProduct >= dispatchBatchQuantity) {
    // Accumulate product until we reach dispatch batch quantity
    while (accumulatedProduct < dispatchBatchQuantity && currentIndex < productionQueue.length) {
      const item = productionQueue[currentIndex];
      accumulatedProduct += item.quantity;
      currentIndex++;
    }

    // If we have enough product to dispatch
    if (accumulatedProduct >= dispatchBatchQuantity) {
      // The packing starts when we have accumulated enough product
      // This is the time when the last required production batch finished printing
      const packingStartTime = productionQueue[currentIndex - 1].availableTime;
      const packingCompleteTime = addHours(packingStartTime, packingTime);
      
      // Determine quantity to dispatch
      let quantityToDispatch = dispatchBatchQuantity;
      
      // Update accumulated product
      accumulatedProduct -= quantityToDispatch;
      cumulativeDispatched += quantityToDispatch;

      dispatches.push({
        dispatchBatchNumber,
        dispatchBatchId: `D-${String(dispatchBatchNumber).padStart(3, '0')}`,
        packingStartTime,
        packingStartTimeFormatted: format(packingStartTime, 'dd-MM-yyyy'),
        packingCompleteTime,
        packingCompleteTimeFormatted: format(packingCompleteTime, 'dd-MM-yyyy'),
        dispatchReadyTime: packingCompleteTime,
        dispatchReadyTimeFormatted: format(packingCompleteTime, 'dd-MM-yyyy'),
        quantityPacked: quantityToDispatch,
        cumulativeDispatched,
      });

      dispatchBatchNumber++;
    } else {
      // No more production batches and not enough for full dispatch batch
      break;
    }
  }

  // Handle remaining product (if any)
  if (accumulatedProduct > 0 && currentIndex >= productionQueue.length) {
    // Pack and dispatch the remaining quantity
    const packingStartTime = productionQueue[productionQueue.length - 1].availableTime;
    const packingCompleteTime = addHours(packingStartTime, packingTime);
    
    cumulativeDispatched += accumulatedProduct;

    dispatches.push({
      dispatchBatchNumber,
      dispatchBatchId: `D-${String(dispatchBatchNumber).padStart(3, '0')}`,
      packingStartTime,
      packingStartTimeFormatted: format(packingStartTime, 'dd-MM-yyyy'),
      packingCompleteTime,
      packingCompleteTimeFormatted: format(packingCompleteTime, 'dd-MM-yyyy'),
      dispatchReadyTime: packingCompleteTime,
      dispatchReadyTimeFormatted: format(packingCompleteTime, 'dd-MM-yyyy'),
      quantityPacked: accumulatedProduct,
      cumulativeDispatched,
    });
  }

  return {
    dispatches,
    totalDispatched: cumulativeDispatched,
    totalBatches: dispatches.length,
    dispatchBatchQuantity,
    packingTimeHours: packingTime,
  };
}
