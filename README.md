<p align="center">
  <a href="https://can-you-outsmart-the-machine-math-ver.onrender.com">
    <img src="assets/readme-banner.png" alt="Can You Outsmart the Machine?">
    Click to play.
  </a>
</p>

# Can You Outsmart the Machine?

> **Human vs Algorithm. Don't calculate faster. Think smarter.**

**Can You Outsmart the Machine?** is a collection of **15+ mathematical, logical, probabilistic, and strategic mini-games** where you compete directly against a machine.

The games challenge you to recognize patterns, reason under constraints, use mathematical strategies, and make better decisions than a computer opponent.

> **Your goal: Think smarter than the machine.**

---

## 🎮 The Games

| # | Game | Difficulty | Core Concept | Points |
|---|---|---|---|---:|
| 1 | 🔢 **24 Game** | 🟢 Easy | Arithmetic | +10 |
| 2 | 🧩 **Pattern Duel** | 🟢 Easy | Pattern Recognition | +10 |
| 3 | 🔮 **Number Hunt** | 🟢 Easy | Binary Search | +10 |
| 4 | ⛓️ **Operator Network** | 🟢 Easy | Arithmetic Reasoning | +10 |
| 5 | ⚙️ **Target Grinder** | 🟢 Easy | Reverse Arithmetic | +10 |
| 6 | 🚪 **Monty Hall** | 🟢 Easy | Probability | +10 |
| 7 | 🐂 **Bulls & Cows** | 🟡 Medium | Logic + One Lie | +15 |
| 8 | 🕵️ **Mastermind** | 🟡 Medium | Deduction | +15 |
| 9 | 🥢 **Nim** | 🟡 Medium | Game Theory | +15 |
| 10 | ♜ **Wythoff's Game** | 🟡 Medium | Number Theory | +15 |
| 11 | 🔵 **Dots & Boxes** | 🟡 Medium | Game Theory | +15 |
| 12 | 🧬 **Symbiotic Feedback** | 🔴 Hard | Adaptive Game Theory | +20 |
| 13 | ⚖️ **Parity-Shift Wythoff** | 🔴 Hard | Positional Strategy | +20 |
| 14 | ⚡ **Inertia Engine** | 🔴 Hard | Dynamic Strategy | +20 |
| 15 | 🧬 **Fibonacci Decay** | 🔴 Hard | Move Locking | +20 |
| 16 | 💡 **Lights Out** | 🔴 Hard | Linear Algebra | +20 |


---

# 📖 Rulebook & Game Guide

## 🟢 EASY

### 🔢 24 Game
Make exactly **24** using all four given numbers exactly once.

**Rules:** Use `+`, `−`, `×`, and `÷`. Parentheses are allowed.

**Example:** Given `3, 3, 8, 8`, find an expression that equals `24`.

**Think:** Look for useful intermediate values rather than trying random combinations.

---

### 🧩 Pattern Duel
Predict the **next TWO terms** of a sequence before the machine.

The game contains **5 questions** with increasing difficulty:

**Easy → Easy/Medium → Medium → Hard → Hard**

Your performance affects how quickly you reach harder questions, but **Q4 and Q5 are guaranteed hard**.

Patterns can involve arithmetic, geometric sequences, squares, cubes, Fibonacci-type rules, increasing differences, alternating operations, interleaved sequences, primes, modular patterns, digit-based rules, higher-order differences, and mixed rules.

**Example:**

`2, 6, 12, 20, 30, ?, ?`

Rule: `n(n + 1)`

Answer: `42, 56`

**Think:** Check differences, ratios, alternating positions, and relationships involving the term position.

---

### 🔮 Number Hunt
Find the machine's hidden number from **1–100**.

You have at most **7 guesses**. After each incorrect guess, the machine tells you whether your guess was too high or too low.

**Best strategy:** Use binary search. Keep choosing the midpoint of the remaining range.

---

### ⛓️ Operator Network
Reach the displayed target using the available arithmetic operations.

Each generated puzzle has a valid solution.

**Think:** If moving forward is difficult, work backwards from the target and ask what operation could have produced it.

---

### ⚙️ Target Grinder
Transform the starting value into the target using the available arithmetic operations.

**Think:** Reverse the problem. Instead of asking what to do next, ask:

> *What could have produced the target?*

---

### 🚪 Monty Hall
Choose the prize door from **3 doors**.

1. Pick a door.
2. The machine reveals another door that it knows is losing.
3. Choose whether to **Stay** or **Switch**.

Your original choice has a `1/3` chance of being correct, while the remaining unopened door has a `2/3` chance.

**Best strategy:** Switch.

---

## 🟡 MEDIUM

### 🐂 Bulls & Cows — One Lie
Crack the machine's hidden **4-digit number** in **15 guesses**.

- 🐂 **Bull:** Correct digit + correct position
- 🐄 **Cow:** Correct digit + wrong position

Exactly **one feedback response is deliberately false**. Every other response is truthful.

**Example:**

Secret: `5274`  
Guess: `5278`  
Correct feedback: `3 Bulls, 0 Cows`

At the end, the machine can reveal the secret, the exact lie, the false feedback, the mathematically correct feedback, and the complete audit of the other guesses.

**Think:** Track the consistency of the entire clue history, not just individual guesses.

---

### 🕵️ Mastermind
Crack the machine's hidden colour code using feedback from your guesses.

Feedback tells you about:

- Correct colours in the correct positions
- Correct colours in the wrong positions

Every guess creates constraints on the possible code.

**Think:** Combine information from all previous guesses to eliminate impossible codes.

---

### 🥢 Nim
Take the final stick.

**Starting state:** `21 sticks`

On each turn, take **1, 2, or 3 sticks**. Whoever takes the last stick wins.

Important losing positions are multiples of `4`:

`4, 8, 12, 16, 20...`

**Think:** Try to leave your opponent a multiple of four.

---

### ♜ Wythoff's Game
Play with two piles.

On each turn you may:

1. Remove any positive number from one pile, **or**
2. Remove the same positive number from both piles.

The player who takes the final token wins.

**Think:** Look for mathematically special losing positions instead of simply reducing the larger pile.

---

### 🔵 Dots & Boxes
Claim more boxes than the machine.

- Draw one edge per turn.
- Completing the fourth side of a box claims it.
- Completing a box gives you **another turn**.
- The player with the most boxes wins.

**Think:** A move that does not score immediately may be better if it prevents the machine from gaining a chain of boxes.

---

## 🔴 HARD

### 🧬 Symbiotic Feedback
Play a two-pile strategic game where your move affects the opponent's available move size on the **opposite pile**.

The machine evaluates future game states rather than simply reacting to the current position.

**Think:** Your move changes the opponent's future options. Think about the state you are creating, not just the tokens you remove.

---

### ⚖️ Parity-Shift Wythoff
A strategic two-pile game where both the pile sizes and the current move restriction matter.

Possible moves involve removing tokens from one pile or removing an equal number from both piles. The previous move affects the move style available next.

**Think:** Track:

- Both pile sizes
- The current restriction
- The move type available to you

The machine evaluates the resulting finite game states.

---

### ⚡ Inertia Engine
Navigate the board without landing on the final **Red** cell.

**Starting state:**

`Position = 0`  
`Velocity = 3`

Your next velocity can be:

`v − 1`, `v`, or `v + 1`

with velocity restricted to `2–5`.

**Cells:**

- 🟢 **Green:** Turn passes to the opponent.
- 🟡 **Yellow:** You move again.
- 🔴 **Red:** Landing here loses.

**Example:**

Current velocity `3` → next velocity can be `2, 3, or 4`.

**Think:** Position alone is not enough. Consider both **where you are** and **what your current velocity is**.

---

### 🧬 Fibonacci Decay
Reach a winning state while managing dynamically locked moves.

When you choose a movement step, that exact step becomes **locked for the opponent**.

**Example:**

You choose `+4` → the opponent cannot choose `+4`.

- 🟡 **Yellow:** Preserves your turn while updating the lock.
- 🔴 **Red:** Losing terminal state.

**Think:** Every move changes both your position and the opponent's future choices.

---

### 💡 Lights Out
Turn every light **OFF** on a `5 × 5` board.

Clicking a cell toggles:

- The cell itself
- Up
- Down
- Left
- Right

Only existing neighbouring cells are affected.

Pressing the same cell twice cancels out:

`ON → OFF → ON`

This creates a natural connection to **binary systems and linear algebra**.

**Think:** Treat the entire board as one mathematical system rather than solving each light independently.

---

# 🧠 What Are You Actually Testing?

| Game | Core Skill |
|---|---|
| 🔢 24 Game | Arithmetic Search |
| 🧩 Pattern Duel | Pattern Recognition |
| 🔮 Number Hunt | Binary Search |
| ⛓️ Operator Network | Arithmetic Reasoning |
| ⚙️ Target Grinder | Reverse Reasoning |
| 🚪 Monty Hall | Conditional Probability |
| 🐂 Bulls & Cows | Logical Deduction |
| 🕵️ Mastermind | Constraint Solving |
| 🥢 Nim | Invariants & Game Theory |
| ♜ Wythoff's Game | Number Theory |
| 🔵 Dots & Boxes | Game-Tree Strategy |
| 🧬 Symbiotic Feedback | State-Space Reasoning |
| ⚖️ Parity-Shift Wythoff | Positional Strategy |
| ⚡ Inertia Engine | Dynamic State Reasoning |
| 🧬 Fibonacci Decay | State + Move Constraints |
| 💡 Lights Out | Linear Algebra |


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