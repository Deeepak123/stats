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
  ];

  extractValues(option: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.inputHtml, 'text/html');

    let elements: Element[] = [];

    if (option === 'playT') {
      elements = Array.from(
        doc.getElementsByClassName('roulette-history-item__value-text--XeOtB')
      );
    } else if (option === 'evo') {
      elements = Array.from(
        doc.getElementsByClassName('value--dd5c7')
      );
    }

    // Extract numbers and parse to integers
    this.data = elements
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .map(val => parseInt(val || '', 10))
      .filter(n => !isNaN(n)); // filter out any NaNs

    // Display as comma-separated in the output textarea
    this.extractedValues = this.data.join(',');
  }

  updateNumber() {
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

    const matchLog: { side: string, gap: number }[] = [];

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
        matchLog.push({ side: matchedSide, gap: sharedGapCounter });


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



    let counter = 0;
    let maxCounter = 0;
    let minCounter = 0;
    let previousSide = matchLog[0].side;

    console.log(`Starting from side: ${previousSide}`);
    console.log('--------------------------------------------------');

    for (let i = 1; i < matchLog.length; i++) {
      const current = matchLog[i];
      const currentSide = current.side;
      const actualGap = current.gap;
      const cappedGap = actualGap > 18 ? 18 : actualGap;

      if (currentSide !== previousSide) {
        // Switch in side
        counter += cappedGap;
        console.log(
          `[${i}] Switch ${previousSide} ➝ ${currentSide}, gap = ${actualGap} ➝ +${cappedGap}, counter = ${counter}`
        );
      } else {
        // Same side
        if (actualGap > 18) {
          counter += 18;
          console.log(
            `[${i}] Same ${currentSide}, gap > 18 ➝ +18, counter = ${counter}`
          );
        } else {
          counter += actualGap;
          console.log(
            `[${i}] Same ${currentSide}, gap = ${actualGap} ➝ +${actualGap}, then -36`
          );
          counter -= 36;
          console.log(
            `     ➝ counter after -36 = ${counter}`
          );
        }
      }

      // Track min and max counter value
      if (counter > maxCounter) maxCounter = counter;
      if (counter < minCounter) minCounter = counter;

      previousSide = currentSide;
    }

    console.log('--------------------------------------------------');
    console.log(`Max loose: ${maxCounter}`);
    console.log(`Max win: ${minCounter}`);
    console.log('Beat till end final result:', counter);
    console.log("-result = very safe, + result (<50) then still can win in between")

  }


  onAltClick() {
    console.log('Alt button clicked');
    const matchLog: { side: string, gap: number }[] = [];

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
        matchLog.push({ side: matchedSide, gap: sharedGapCounter });

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


    let counter = 0;
    let maxCounter = 0;
    let minCounter = 0;
    let previousSide = matchLog[0].side;

    console.log(`Starting from side: ${previousSide}`);
    console.log('--------------------------------------------------');

    for (let i = 1; i < matchLog.length; i++) {
      const current = matchLog[i];
      const currentSide = current.side;
      const actualGap = current.gap;
      const cappedGap = actualGap > 18 ? 18 : actualGap;

      if (currentSide !== previousSide) {
        // Switch in side
        counter += cappedGap;
        console.log(
          `[${i}] Switch ${previousSide} ➝ ${currentSide}, gap = ${actualGap} ➝ +${cappedGap}, counter = ${counter}`
        );
      } else {
        // Same side
        if (actualGap > 18) {
          counter += 18;
          console.log(
            `[${i}] Same ${currentSide}, gap > 18 ➝ +18, counter = ${counter}`
          );
        } else {
          counter += actualGap;
          console.log(
            `[${i}] Same ${currentSide}, gap = ${actualGap} ➝ +${actualGap}, then -36`
          );
          counter -= 36;
          console.log(
            `     ➝ counter after -36 = ${counter}`
          );
        }
      }

      // Track min and max counter value
      if (counter > maxCounter) maxCounter = counter;
      if (counter < minCounter) minCounter = counter;

      previousSide = currentSide;
    }

    console.log('--------------------------------------------------');
    console.log(`Max loose: ${maxCounter}`);
    console.log(`Max win: ${minCounter}`);
    console.log('Beat till end final result:', counter);
    console.log("-result = very safe, + result (<50) then still can win in between")
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
