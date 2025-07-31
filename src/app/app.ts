import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  inputHtml: string = '';
  targetClass: string = 'target';
  extractedValues: string = '';
  data: number[] = [
    16, 18, 11, 2, 10, 8, 1, 36, 4, 8, 9, 10, 35, 7, 36, 7, 25, 25, 34, 21, 11, 19, 28, 28, 8, 7, 29, 13, 6, 32, 4, 15, 2, 22, 34, 32, 35, 24, 21, 9, 34, 32, 14, 34, 12, 2, 33, 29, 16, 36, 25, 30, 18, 17, 1, 30, 34, 8, 26, 8, 11, 18, 36, 10, 1, 30, 20, 13, 8, 23, 25, 36, 29, 24, 31, 28, 14, 21, 13, 7, 31, 16, 6, 32, 28, 24, 12, 12, 34, 6, 29, 35, 21, 32, 4, 17, 7, 12, 22, 15, 29, 34, 29, 2, 8, 3, 33, 31, 30, 25, 4, 6, 23, 17, 0, 11, 18, 31, 30, 4, 5, 20, 7, 11, 18, 22, 28, 21, 2, 12, 14, 5, 28, 33, 27, 17, 21, 1, 26, 22, 21, 9, 28, 16, 21, 17, 4, 18, 3, 14, 2, 36, 12, 11, 4, 9, 8, 34, 25, 7, 31, 23, 5, 9, 11, 21, 8, 13, 30, 32, 36, 24, 4, 3, 6, 34, 5, 29, 29, 6, 10, 29, 33, 11, 9, 23, 31, 34, 6, 15, 16, 1, 27, 5, 29, 9, 27, 5, 18, 2, 22, 12, 33, 13, 10, 19, 9, 0, 32, 10, 32, 20, 2, 11, 32, 13, 34, 31, 12, 6, 32, 19, 9, 14, 22, 30, 24, 22, 21, 14, 34, 4, 18, 27, 8, 7, 35, 27, 17, 13, 23, 11, 16, 8, 28, 17, 29, 34, 26, 14, 4, 8, 3, 32, 1, 20, 1, 8, 35, 31, 4, 33, 22, 23, 14, 15, 15, 0, 29, 3, 29, 36, 36, 16, 21, 0, 3, 36, 0, 14, 4, 2, 20, 18, 15, 4, 19, 8, 20, 10, 11, 5, 36, 27, 9, 21, 15, 18, 16, 2, 30, 6, 2, 22, 35, 19, 35, 34, 35, 29, 8, 27, 3, 17, 0, 11, 19, 16, 1, 1, 31, 16, 12, 14, 32, 23, 32, 4, 2, 7, 33, 28, 33, 21, 22, 30, 1, 10, 16, 13, 32, 10, 19, 19, 1, 20, 3, 1, 7, 29, 12, 2, 10, 15, 29, 35, 29, 2, 1, 31, 23, 2, 13, 26, 15, 4, 4, 12, 32, 1, 36, 12, 31, 11, 1, 35, 33, 15, 11, 8, 4, 18, 29, 30, 9, 9, 35, 18, 1, 10, 16, 0, 26, 20, 6, 14, 24, 21, 29, 7, 16, 25, 28, 31, 10, 11, 24, 23, 1, 34, 15, 16, 8, 26, 10, 28, 33, 24, 3, 5, 28, 36, 26, 16, 29, 24, 22, 21, 20, 17, 3, 32, 23, 1, 33, 28, 20, 5, 3, 27, 19, 13, 2, 27, 26, 11, 15, 7, 9, 2, 4, 34, 26, 33, 9, 8, 13, 18, 31, 16, 9, 13, 30, 3, 11, 31, 32, 7, 27, 10, 11, 1, 11, 25, 10, 10, 34, 7, 20, 23, 26, 33, 13, 28, 17, 2, 1, 16]






  extractValues() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.inputHtml, 'text/html');

    // Get all elements with the required class
    // const elements = Array.from(
    //   doc.getElementsByClassName('roulette-history-item__value-text--XeOtB')
    // );

    const elements = Array.from(
      doc.getElementsByClassName('value--dd5c7')
    );

    // Extract numbers and parse to integers
    this.data = elements
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .map(val => parseInt(val || '', 10))
      .filter(n => !isNaN(n)); // filter out any NaNs

    // Display as comma-separated in the output textarea
    this.extractedValues = this.data.join(',');
  }

  updateEvo() {
    if (this.extractedValues) {
      this.data = this.extractedValues
        .split(',')
        .map(value => Number(value.trim()))
        .filter(val => !isNaN(val)); // Optional: filters out invalid numbers
    }

    console.log("all data now ->" + this.data);
  }

  onLineClick() {
    console.log('Alt button clicked');

    const data = this.data.slice().reverse(); // Latest to oldest
    const allGaps: number[] = [];
    const leftGaps: number[] = [];
    const rightGaps: number[] = [];

    let lastSuccessIndex: number | null = null;
    let lastLeftSuccessIndex: number | null = null;
    let lastRightSuccessIndex: number | null = null;

    let sharedGapCounter = 0;
    let leftGapCounter = 0;
    let rightGapCounter = 0;

    // Shared strategy (2-number, 18 rounds)
    let totalProfit = 0;
    let totalLoss = 0;
    let winCount = 0;
    let lossCount = 0;

    // Left-only strategy (1-number, 36 rounds)
    let leftProfit = 0;
    let leftLossTotal = 0;
    let leftWinCount = 0;
    let leftLossCount = 0;

    // Right-only strategy (1-number, 36 rounds)
    let rightProfit = 0;
    let rightLossTotal = 0;
    let rightWinCount = 0;
    let rightLossCount = 0;

    // Directional strategy (1 number, switch side after miss)
    let directionalFailures: number[] = [];
    let directionalEarned = 0;
    let directionalSuccesses = 0;
    let directionalGapCounter = 0;
    let lastDirection: 'LEFT' | 'RIGHT' | null = null;

    for (let i = 0; i < data.length - 1; i++) {
      const current = data[i];
      const next = data[i + 1];
      const [left, right] = this.getNeighbors(current);

      const isLeft = next === left;
      const isRight = next === right;

      // Shared strategy (either side hits)
      if (isLeft || isRight) {
        const matchedSide = isLeft ? 'LEFT' : 'RIGHT';
        console.log(`${next} is ${matchedSide} neighbour of ${current} -> ${current}'s neighbours [${left}, ${right}], gap = ${sharedGapCounter}`);
        allGaps.push(sharedGapCounter);

        if (sharedGapCounter <= 18) {
          const cost = sharedGapCounter * 2;
          totalProfit += 36 - cost;
          winCount++;
        } else {
          totalLoss += 36;
          lossCount++;
        }

        lastSuccessIndex = i;
        sharedGapCounter = 0;
      } else {
        sharedGapCounter++;
      }

      // LEFT-only strategy
      if (isLeft) {
        leftGaps.push(leftGapCounter);
        if (leftGapCounter <= 36) {
          leftProfit += 36 - leftGapCounter;
          leftWinCount++;
        } else {
          leftLossTotal += 36;
          leftLossCount++;
        }
        lastLeftSuccessIndex = i;
        leftGapCounter = 0;
      } else {
        leftGapCounter++;
      }

      // RIGHT-only strategy
      if (isRight) {
        rightGaps.push(rightGapCounter);
        if (rightGapCounter <= 36) {
          rightProfit += 36 - rightGapCounter;
          rightWinCount++;
        } else {
          rightLossTotal += 36;
          rightLossCount++;
        }
        lastRightSuccessIndex = i;
        rightGapCounter = 0;
      } else {
        rightGapCounter++;
      }

      // Directional strategy (one side, switch if failure)
      if (isLeft || isRight) {
        const currentSide = isLeft ? 'LEFT' : 'RIGHT';

        if (lastSuccessIndex !== null && currentSide !== lastDirection) {
          directionalFailures.push(directionalGapCounter);
        }

        if (directionalGapCounter <= 36) {
          directionalEarned += 36 - directionalGapCounter;
          directionalSuccesses++;
        }

        directionalGapCounter = 0;
        lastSuccessIndex = i;
        lastDirection = currentSide;
      } else {
        directionalGapCounter++;
      }
    }

    // --- Final Summary Calculations ---
    const net = totalProfit - totalLoss;
    const safePercent = Math.round((winCount / (winCount + lossCount)) * 100);
    const isSafe = safePercent >= 70 ? 'Yes ✅' : 'No ❌';

    const leftNet = leftProfit - leftLossTotal;
    const leftSafePercent = Math.round((leftWinCount / (leftWinCount + leftLossCount)) * 100);
    const isLeftSafe = leftSafePercent >= 70 ? 'Yes ✅' : 'No ❌';

    const rightNet = rightProfit - rightLossTotal;
    const rightSafePercent = Math.round((rightWinCount / (rightWinCount + rightLossCount)) * 100);
    const isRightSafe = rightSafePercent >= 70 ? 'Yes ✅' : 'No ❌';

    const totalDirectionalLoss = directionalFailures.reduce((sum, val) => sum + val, 0);
    const directionalNet = directionalEarned - totalDirectionalLoss;
    const avgSwitchGap = directionalFailures.length ? (totalDirectionalLoss / directionalFailures.length).toFixed(2) : '0';
    const successRatio = directionalSuccesses / (directionalFailures.length + directionalSuccesses);
    const isDirectionalSafe = successRatio >= 0.7 ? 'Yes ✅' : 'No ❌';

    // --- Logs ---
    console.log('\nAll Gaps:', allGaps);
    console.log('Left Gaps:', leftGaps);
    console.log('Right Gaps:', rightGaps);

    if (lastSuccessIndex !== null) {
      console.log('Last success index:', 500 - (lastSuccessIndex + 2));
    }

    if (lastLeftSuccessIndex !== null) {
      console.log('Last LEFT success index:', 500 - (lastLeftSuccessIndex + 2));
    }

    if (lastRightSuccessIndex !== null) {
      console.log('Last RIGHT success index:', 500 - (lastRightSuccessIndex + 2));
    }

    // --- Summary Reports ---
    console.log(`\n--- Shared Strategy (2 numbers, 18 rounds) ---`);
    console.log(`Total Gaps (Success Found): ${allGaps.length}`);
    console.log(`Wins within 18 rounds: ${winCount}`);
    console.log(`Losses (after 18 rounds): ${lossCount}`);
    console.log(`Total Profit: +${totalProfit}`);
    console.log(`Total Loss: -${totalLoss}`);
    console.log(`Net Result: ${net >= 0 ? '+' : ''}${net}`);
    console.log(`Safe Table Play: ${isSafe} (${safePercent}%)`);

    console.log(`\n--- Left Strategy (1 number, 36 rounds) ---`);
    console.log(`Wins: ${leftWinCount}`);
    console.log(`Losses: ${leftLossCount}`);
    console.log(`Profit: +${leftProfit}`);
    console.log(`Loss: -${leftLossTotal}`);
    console.log(`Net: ${leftNet >= 0 ? '+' : ''}${leftNet}`);
    console.log(`Safe to Play Left: ${isLeftSafe} (${leftSafePercent}%)`);

    console.log(`\n--- Right Strategy (1 number, 36 rounds) ---`);
    console.log(`Wins: ${rightWinCount}`);
    console.log(`Losses: ${rightLossCount}`);
    console.log(`Profit: +${rightProfit}`);
    console.log(`Loss: -${rightLossTotal}`);
    console.log(`Net: ${rightNet >= 0 ? '+' : ''}${rightNet}`);
    console.log(`Safe to Play Right: ${isRightSafe} (${rightSafePercent}%)`);

    console.log(`\n--- Directional Strategy (1 number, 36 rounds, switch on miss) ---`);
    console.log(`Total Switches: ${directionalFailures.length}`);
    console.log(`Failure Gaps Before Each Switch: ${directionalFailures.join(', ')}`);
    console.log(`Total Failure Rounds: ${totalDirectionalLoss}`);
    console.log(`Total Earned After Successful Hit: +${directionalEarned}`);
    console.log(`Directional Successes: ${directionalSuccesses}`);
    console.log(`Net Profit: ${directionalNet >= 0 ? '+' : ''}${directionalNet}`);
    console.log(`Average Rounds Before Switch: ${avgSwitchGap}`);
    console.log(`Longest Failure Gap: ${Math.max(...directionalFailures, 0)}`);
    console.log(`Safe to Play: ${isDirectionalSafe} (${Math.round(successRatio * 100)}%)`);
  }


  onAltClick() {
    console.log('Alt button clicked');

    const data = this.data.slice().reverse(); // Latest to oldest
    const allGaps: number[] = [];
    const leftGaps: number[] = [];
    const rightGaps: number[] = [];

    let lastSuccessIndex: number | null = null;
    let lastLeftSuccessIndex: number | null = null;
    let lastRightSuccessIndex: number | null = null;

    let sharedGapCounter = 0;
    let leftGapCounter = 0;
    let rightGapCounter = 0;

    // Shared strategy
    let totalProfit = 0;
    let totalLoss = 0;
    let winCount = 0;
    let lossCount = 0;

    // Left strategy
    let leftProfit = 0;
    let leftLossTotal = 0;
    let leftWinCount = 0;
    let leftLossCount = 0;

    // Right strategy
    let rightProfit = 0;
    let rightLossTotal = 0;
    let rightWinCount = 0;
    let rightLossCount = 0;

    // Directional strategy
    let currentDirection: 'LEFT' | 'RIGHT' | null = null;
    let directionalGap = 0;
    let directionalFailures: number[] = [];
    let directionalSuccesses: number[] = [];
    let directionalEarned = 0;
    let totalDirectionalLoss = 0;

    for (let i = 0; i < data.length - 2; i++) {
      const current = data[i];
      const next = data[i + 2];
      const [left, right] = this.getNeighbors(current);

      const isLeft = next === left;
      const isRight = next === right;

      // Shared strategy
      if (isLeft || isRight) {
        const matchedSide = isLeft ? 'LEFT' : 'RIGHT';
        console.log(`${next} is ${matchedSide} neighbour of ${current} -> [${left}, ${right}], gap = ${sharedGapCounter}`);
        allGaps.push(sharedGapCounter);

        if (sharedGapCounter <= 18) {
          const cost = sharedGapCounter * 2;
          totalProfit += 36 - cost;
          winCount++;
        } else {
          totalLoss += 36;
          lossCount++;
        }

        lastSuccessIndex = i;
        sharedGapCounter = 0;
      } else {
        sharedGapCounter++;
      }

      // Left strategy
      if (isLeft) {
        leftGaps.push(leftGapCounter);
        if (leftGapCounter <= 36) {
          leftProfit += 36 - leftGapCounter;
          leftWinCount++;
        } else {
          leftLossTotal += 36;
          leftLossCount++;
        }
        lastLeftSuccessIndex = i;
        leftGapCounter = 0;
      } else {
        leftGapCounter++;
      }

      // Right strategy
      if (isRight) {
        rightGaps.push(rightGapCounter);
        if (rightGapCounter <= 36) {
          rightProfit += 36 - rightGapCounter;
          rightWinCount++;
        } else {
          rightLossTotal += 36;
          rightLossCount++;
        }
        lastRightSuccessIndex = i;
        rightGapCounter = 0;
      } else {
        rightGapCounter++;
      }

      // Directional strategy
      if (currentDirection === null) {
        if (isLeft) currentDirection = 'LEFT';
        else if (isRight) currentDirection = 'RIGHT';
        directionalGap = 0;
      } else {
        const isMatch = (currentDirection === 'LEFT' && isLeft) || (currentDirection === 'RIGHT' && isRight);
        const isSwitch = (currentDirection === 'LEFT' && isRight) || (currentDirection === 'RIGHT' && isLeft);

        if (isMatch) {
          const earned = 36 - directionalGap;
          directionalEarned += earned;
          directionalSuccesses.push(directionalGap);
          directionalGap = 0;
        } else if (isSwitch) {
          directionalFailures.push(directionalGap);
          totalDirectionalLoss += directionalGap;
          currentDirection = isLeft ? 'LEFT' : 'RIGHT';
          directionalGap = 0;
        } else {
          directionalGap++;
        }
      }
    }

    // --- Summary calculations ---
    const directionalNet = directionalEarned - totalDirectionalLoss;
    const avgSwitchGap = directionalFailures.length
      ? Math.round(directionalFailures.reduce((a, b) => a + b, 0) / directionalFailures.length)
      : 0;
    const successRatio = directionalSuccesses.length / (directionalFailures.length || 1);
    const isDirectionalSafe = successRatio >= 0.7 ? 'Yes ✅' : 'No ❌';

    // Shared strategy summary
    const net = totalProfit - totalLoss;
    const safePercent = Math.round((winCount / (winCount + lossCount)) * 100);
    const isSafe = safePercent >= 70 ? 'Yes ✅' : 'No ❌';

    const leftNet = leftProfit - leftLossTotal;
    const leftSafePercent = Math.round((leftWinCount / (leftWinCount + leftLossCount)) * 100);
    const isLeftSafe = leftSafePercent >= 70 ? 'Yes ✅' : 'No ❌';

    const rightNet = rightProfit - rightLossTotal;
    const rightSafePercent = Math.round((rightWinCount / (rightWinCount + rightLossCount)) * 100);
    const isRightSafe = rightSafePercent >= 70 ? 'Yes ✅' : 'No ❌';

    // --- Logs ---
    console.log('\nAll Gaps:', allGaps);
    console.log('Left Gaps:', leftGaps);
    console.log('Right Gaps:', rightGaps);

    if (lastSuccessIndex !== null) {
      console.log('Last success index:', 500 - (lastSuccessIndex + 3));
    }
    if (lastLeftSuccessIndex !== null) {
      console.log('Last LEFT success index:', 500 - (lastLeftSuccessIndex + 3));
    }
    if (lastRightSuccessIndex !== null) {
      console.log('Last RIGHT success index:', 500 - (lastRightSuccessIndex + 3));
    }

    console.log(`\n--- Shared Strategy (2 numbers, 18 rounds) ---`);
    console.log(`Wins within 18 rounds: ${winCount}`);
    console.log(`Losses (after 18 rounds): ${lossCount}`);
    console.log(`Total Profit: +${totalProfit}`);
    console.log(`Total Loss: -${totalLoss}`);
    console.log(`Net Result: ${net >= 0 ? '+' : ''}${net}`);
    console.log(`Safe Table Play: ${isSafe} (${safePercent}%)`);

    console.log(`\n--- Left Strategy (1 number, 36 rounds) ---`);
    console.log(`Wins: ${leftWinCount}`);
    console.log(`Losses: ${leftLossCount}`);
    console.log(`Profit: +${leftProfit}`);
    console.log(`Loss: -${leftLossTotal}`);
    console.log(`Net: ${leftNet >= 0 ? '+' : ''}${leftNet}`);
    console.log(`Safe to Play Left: ${isLeftSafe} (${leftSafePercent}%)`);

    console.log(`\n--- Right Strategy (1 number, 36 rounds) ---`);
    console.log(`Wins: ${rightWinCount}`);
    console.log(`Losses: ${rightLossCount}`);
    console.log(`Profit: +${rightProfit}`);
    console.log(`Loss: -${rightLossTotal}`);
    console.log(`Net: ${rightNet >= 0 ? '+' : ''}${rightNet}`);
    console.log(`Safe to Play Right: ${isRightSafe} (${rightSafePercent}%)`);

    console.log(`\n--- Directional Strategy (1 number, 36 rounds, switch on miss) ---`);
    console.log(`Total Switches: ${directionalFailures.length}`);
    console.log(`Failure Gaps Before Each Switch: ${directionalFailures.join(', ')}`);
    console.log(`Total Failure Rounds: ${totalDirectionalLoss}`);
    console.log(`Total Earned After Successful Hit: +${directionalEarned}`);
    console.log(`Directional Successes: ${directionalSuccesses}`);
    console.log(`Net Profit: ${directionalNet >= 0 ? '+' : ''}${directionalNet}`);
    console.log(`Average Rounds Before Switch: ${avgSwitchGap}`);
    console.log(`Longest Failure Gap: ${Math.max(...directionalFailures, 0)}`);
    console.log(`Safe to Play: ${isDirectionalSafe} (${Math.round(successRatio * 100)}%)`);
  }





  onAltLClick() {
    console.log('AltL button clicked');
    this.extractedValues = 'AltL button was pressed';
  }

  onAltRClick() {
    console.log('AltR button clicked');
    this.extractedValues = 'AltR button was pressed';
  }

  onLineLClick() {
    console.log('LineL button clicked');
    this.extractedValues = 'LineL button was pressed';
  }

  onLineRClick() {
    console.log('LineR button clicked');
    this.extractedValues = 'LineR button was pressed';
  }

  getNeighbors(num: number): number[] {
    const wheel = [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
      11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9,
      22, 18, 29, 7, 28, 12, 35, 3, 26
    ];

    const index = wheel.indexOf(num);
    if (index === -1) return [];

    const left = wheel[(index - 1 + wheel.length) % wheel.length];
    const right = wheel[(index + 1) % wheel.length];

    return [left, right];
  }


}


export const App = AppComponent;
