<p align="center">
  <a href="https://can-you-outsmart-the-machine-math-ver.onrender.com">
    <img src="assets/readme-banner.png" alt="Can You Outsmart the Machine?">
    Click to play.
  </a>
</p>

# 🧠 Can You Outsmart the Machine?

> **Human vs Algorithm. Don't calculate faster. Think smarter.**

**Can You Outsmart the Machine?** is a collection of 16 mathematical, logical, probabilistic, and strategic mini-games where you compete directly against a machine.

The machine doesn't just throw random challenges at you — several games use **search, game theory, dynamic programming, constraint solving, probability, number theory, or exact finite-state analysis**.

Your goal is simple:

> **Think smarter than the machine.**

---

## 🎮 The Games

| #  | Game                        | Difficulty  | Core Idea            |
| -- | --------------------------- | ----------- | -------------------- |
| 1  | 🔢 **24 Game**              | Easy        | Arithmetic & search  |
| 2  | 🧩 **Pattern Duel**         | Easy → Hard | Pattern recognition  |
| 3  | 🔮 **Number Hunt**          | Easy        | Binary search        |
| 4  | ⛓️ **Operator Network**     | Easy        | Arithmetic reasoning |
| 5  | ⚙️ **Target Grinder**       | Easy        | Reverse operations   |
| 6  | 🚪 **Monty Hall**           | Easy        | Probability          |
| 7  | 🐂 **Bulls & Cows**         | Medium      | Deduction + one lie  |
| 8  | 🕵️ **Mastermind**          | Medium      | Constraint solving   |
| 9  | 🥢 **Nim**                  | Medium      | Game theory          |
| 10 | 🧬 **Symbiotic Feedback**   | Medium      | Adaptive game theory |
| 11 | ⚖️ **Parity-Shift Wythoff** | Medium      | Positional strategy  |
| 12 | 🟢 **Inertia Engine**       | Medium      | Dynamic game state   |
| 13 | 🔒 **Fibonacci Decay**      | Medium      | Move locking         |
| 14 | 🔵 **Dots & Boxes**         | Hard        | Game-tree strategy   |
| 15 | 💡 **Lights Out**           | Hard        | Linear algebra       |
| 16 | ♜ **Wythoff's Game**        | Hard        | Number theory        |

---

# 📖 Rulebook

## 🟢 EASY

### 1. 🔢 24 Game

**Objective:** Make exactly **24** using all four given numbers.

**Rules**

* Use every given number **exactly once**.
* Allowed operations:

  * `+`
  * `−`
  * `×`
  * `÷`
* Parentheses are allowed.
* You have **60 seconds**.

**Example**

Given:

`3, 3, 8, 8`

Find an expression equal to `24`.

**Think:** Don't calculate randomly. Look for useful intermediate values such as `8 − 3 = 5` or `8 ÷ 4 = 2`.

---

### 2. 🧩 Pattern Duel

**Objective:** Predict the **next TWO terms** of a sequence before the machine locks in.

This is a five-question duel.

**Difficulty progression**

`ROOKIE → THINKER → STRATEGIST → MACHINE MODE`

The difficulty adapts to your performance.

* Q1 starts easy.
* Good performance pushes the difficulty upward.
* Strong players reach harder questions earlier.
* **Q4 and Q5 are guaranteed hard.**
* The machine also has its own lock-in time.
* You must get both predicted terms correct **and** beat the machine's lock time to win the question.

**Example**

`2 → 6 → 12 → 20 → 30 → ? → ?`

The rule is:

`n(n + 1)`

So:

`42 → 56`

**Possible pattern types**

* Arithmetic progressions
* Geometric progressions
* Squares and cubes
* Fibonacci-type sequences
* Increasing/decreasing differences
* Alternating operations
* Interleaved sequences
* Prime-based patterns
* Modular cycles
* Digit-based rules
* Second/third differences
* Nested and mixed rules

**Think:** Look at differences, ratios, alternating positions, and familiar mathematical structures.

---

### 3. 🔮 Number Hunt

**Objective:** Find the machine's hidden number from **1–100**.

**Rules**

* The machine chooses one number from `1–100`.
* You have at most **7 guesses**.
* After every incorrect guess, you receive:

  * `Too high`
  * or `Too low`

**Best strategy:** Binary search.

Instead of guessing randomly:

`1–100 → 50 → smaller range → midpoint → ...`

Seven guesses are enough to guarantee finding any number from 1–100 with optimal play.

---

### 4. ⛓️ Operator Network

**Objective:** Transform the starting number into the target using the displayed arithmetic operations.

**Rules**

* A chain of numbers/operators is provided.
* Rearrange or choose the available operations according to the puzzle.
* Reach the exact target.
* Every generated puzzle has a valid solution.

**Think:** Work backwards from the target when the forward path looks difficult.

---

### 5. ⚙️ Target Grinder

**Objective:** Arrange a set of arithmetic moves to transform a starting value into the target.

**Rules**

* You are given a starting value and a collection of operations.
* Arrange the operations in the correct order.
* Apply every required operation.
* Reach the target exactly.

The puzzle is generated backwards from the target, guaranteeing that a valid solution exists.

**Think:** Sometimes the easiest route is to ask:

> "What operation could have produced the target?"

and work backwards.

---

### 6. 🚪 Monty Hall

**Objective:** Choose the door containing the prize.

There are **3 doors**:

* 🚗 One contains the prize.
* ❌ Two contain losing outcomes.

**Rules**

1. Pick one door.
2. The machine opens another door that it knows does **not** contain the prize.
3. You may:

   * **Stay** with your original door.
   * **Switch** to the remaining unopened door.

**The mathematics**

Your original choice has:

`1/3` chance of being correct.

The other two doors collectively have:

`2/3` chance.

After the machine reveals a losing door, that `2/3` probability transfers to the remaining unopened door.

**Best strategy:** Switch.

---

# 🟡 MEDIUM

### 7. 🐂 Bulls & Cows — One Lie

**Objective:** Crack the machine's hidden **4-digit number**.

You have **15 guesses**.

**Feedback**

* 🐂 **Bull** = correct digit **and** correct position.
* 🐄 **Cow** = correct digit but **wrong position**.

The machine deliberately gives **exactly ONE false feedback** during the game.

Every other feedback is truthful.

**Example**

Secret:

`5274`

Guess:

`5278`

Feedback:

`3 Bulls, 0 Cows`

The `5`, `2`, and `7` are correct and correctly positioned.

**The twist**

One feedback response during your 15 guesses is a lie.

When the game ends, the machine can reveal:

* The secret number
* The guess where the lie occurred
* The feedback it gave
* The mathematically correct feedback
* Why that feedback was the lie

**Think:** Don't only track the secret. Track whether the entire history of clues remains logically consistent.

---

### 8. 🕵️ Mastermind

**Objective:** Crack the hidden colour code.

**Rules**

* The machine creates a secret code.
* Enter your guesses.
* Feedback tells you how many:

  * **Exact matches** exist.
  * Correct colours exist in the wrong positions.
* Use the feedback to eliminate impossible codes.

**Think:** Every guess is a constraint. Don't treat guesses independently — combine all previous information.

---

### 9. 🥢 Nim

**Objective:** Take the last stick.

**Starting state:** `21 sticks`

**Rules**

* You move first.
* On each turn, take **1, 2, or 3 sticks**.
* Whoever takes the final stick wins.

The machine plays optimally.

**The key idea**

The important positions are:

`4, 8, 12, 16, 20...`

These are multiples of `4`.

If you can leave a multiple of four after your turn, the opponent is placed in a losing position under perfect play.

**Think:** Don't just count sticks. Look for the invariant.

---

### 10. 🧬 Symbiotic Feedback

**Objective:** Take the final token from two linked piles.

**Starting state**

* Pile A = `8`
* Pile B = `12`

**Rules**

* Normally, you may remove **1–3 tokens**.
* Choose either pile.
* Your move changes the opponent's maximum move on the **opposite pile**.

If you take `k` from one pile:

`Opposite pile maximum = 4 − k`

**Example**

You take `2` from A.

The next player may take at most:

`4 − 2 = 2`

from B.

**Important:** The restriction applies to the opposite pile, while the pile you just played on resets to a maximum of 3.

**Winning condition:** Take the final token.

**Think:** Your move doesn't just change the pile size. It changes the opponent's future options.

---

### 11. ⚖️ Parity-Shift Wythoff

**Objective:** Take the last token while obeying the current move-style restriction.

This is a strategic variation inspired by Wythoff-style two-pile games.

**Core move types**

* Remove tokens from pile A.
* Remove tokens from pile B.
* Remove the same number from both piles.

The twist is that the allowed move style is affected by the previous move.

**Think:** You are managing two things at once:

1. The pile sizes.
2. Which type of move is available next.

The machine evaluates the game state using exact finite-state search.

---

### 12. 🟢 Inertia Engine

**Objective:** Navigate the track without being forced onto the final Red cell.

**Starting state**

* Position = `0`
* Velocity = `3`

**Rules**

Your next velocity can be:

`v − 1`, `v`, or `v + 1`

while remaining between:

`2 and 5`

So if your current velocity is `3`, your choices are:

`2, 3, 4`

**Special cells**

* 🟢 Green → turn passes to the opponent.
* 🟡 Yellow → **the same player moves again**.
* 🔴 Red → the final cell; landing there loses.

The chosen velocity becomes your movement amount and becomes the new velocity for the next decision.

**Think:** Position alone is not enough. Your **velocity is part of the game state**.

---

### 13. 🔒 Fibonacci Decay

**Objective:** Reach a winning position without being forced onto Red.

**Movement**

Choose a step from:

`2, 3, 4, 5`

**The Lock**

After you choose a step, that exact step becomes **locked for the opponent**.

Example:

> You choose `+4`.

The opponent cannot choose `+4`.

**Yellow cells**

Landing on Yellow means:

> **You keep the turn.**

The lock still applies.

**Red**

Landing on the final Red cell means:

> **You lose.**

**Think:** The same position can have completely different strategic value depending on which step is currently locked.

---

# 🔴 HARD

### 14. 🔵 Dots & Boxes

**Objective:** Claim more boxes than the machine.

The board is a small **2×2 Dots & Boxes** grid.

**Rules**

* Draw one edge per turn.
* Completing the fourth side of a box claims it.
* If you complete a box, you get another turn.
* The game ends when all boxes are claimed.
* The player who claims more boxes wins.

**Think:** Sometimes the best move is not the move that scores immediately. Avoid giving the opponent a chain of boxes when possible.

The machine searches possible future game states rather than simply choosing a random edge.

---

### 15. 💡 Lights Out

**Objective:** Turn **all lights off**.

**Board:** `5 × 5`

**Rules**

* Clicking a light toggles:

  * itself
  * the light above
  * the light below
  * the light to the left
  * the light to the right
* Edge cells only affect neighbours that actually exist.
* A light can be toggled multiple times.

**Important property**

Toggling the same light twice cancels out:

`ON → OFF → ON`

So each switch effectively behaves like a binary variable:

`0 = don't press`

`1 = press`

The machine can search possible first-row configurations to derive a solution.

**Think:** Don't solve each light independently. Think in terms of the entire board state.

---

### 16. ♜ Wythoff's Game

**Objective:** Take the last token from two piles.

**Rules**

On each turn you may:

1. Remove any positive number from **one pile**, or
2. Remove the **same positive number from both piles**.

The player who takes the final token wins.

**Mathematical strategy**

Sort the piles:

`a ≤ b`

Let:

`k = b − a`

A classic losing position occurs when:

`a = floor(kφ)`

where:

`φ = (1 + √5) / 2 ≈ 1.618`

Some losing positions are:

`(0,0), (1,2), (2,4), (3,5), (4,7), (5,8)...`

**Think:** The machine is looking for these mathematically special positions.

---

# 🏆 Machine Breakers

Beat the machine and you can enter the **Machine Breakers** Hall of Fame.

Scores are based on game difficulty:

| Difficulty | Base Points |
| ---------- | ----------: |
| 🟢 Easy    |         +10 |
| 🟡 Medium  |         +15 |
| 🔴 Hard    |         +20 |

Some games apply additional performance multipliers.

The leaderboard stores the **top 10 scores on the device**.

The game also tracks how many machine-breaking wins have been recorded **today on that browser/device**.

---

# 🧠 The Golden Rule

You don't need to be the fastest calculator.

You need to recognize the structure.

| If you see...                         | Think...                |
| ------------------------------------- | ----------------------- |
| Ordered search space                  | Binary search           |
| Repeating differences                 | Sequence analysis       |
| Two piles                             | Game theory             |
| Limited moves                         | Invariants              |
| Many possible codes                   | Constraint solving      |
| Probability with information revealed | Conditional probability |
| A changing game state                 | Dynamic programming     |
| Toggle-based puzzles                  | Linear algebra          |
| Special number positions              | Number theory           |
| A machine that keeps responding       | Adversarial strategy    |

---

## ⚔️ Final Challenge

There are no shortcuts.

No random guessing.

No hoping the machine makes a mistake.

> **Find the pattern. Find the invariant. Find the winning state.**

### Can you outsmart the machine?
