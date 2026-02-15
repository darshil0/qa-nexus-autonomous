---
name: tiny-gpt
description: Dependency-free Python GPT implementation for educational and reference purposes. Use when asking about "Transformer architecture", "Autograd", or "Attention mechanisms".
version: 1.0.0
author: Andrej Karpathy
adapted By: Darshil
license: MIT
---

# Tiny GPT

Pure Python implementation of a Generative Pre-trained Transformer.

## Purpose

This skill provides a minimal, educational implementation of a GPT model in pure Python with zero external dependencies (no PyTorch, TensorFlow, or NumPy). It demonstrates fundamental concepts of transformer architecture, autograd, and language model training.

## Educational Value

**Key Concepts Demonstrated**:
- **Autograd Engine**: Automatic differentiation through computation graphs
- **Attention Mechanism**: Multi-head self-attention from first principles
- **Transformer Architecture**: Token embeddings, positional encoding, layer normalization
- **Training Loop**: Adam optimizer, gradient descent, loss calculation
- **Inference**: Autoregressive text generation with temperature sampling

## Attribution

This implementation is based on educational work by **Andrej Karpathy** ([@karpathy](https://github.com/karpathy)):

- **Original Project**: nanoGPT
- **Repository**: https://github.com/karpathy/nanoGPT
- **License**: MIT
- **Adapted for**: QA Nexus Autonomous Skills System

The original nanoGPT project demonstrates transformer architectures in their most fundamental form, making complex ML concepts accessible for educational purposes.

## Scripts

### `scripts/tiny_gpt.py`

**Main Implementation**: Complete GPT training and inference engine in ~150 lines of pure Python.

**Features**:
- Pure Python (no external ML libraries)
- Custom autograd implementation (Value class)
- GPT-2 style architecture (with simplifications)
- Character-level tokenization
- Adam optimizer
- Temperature-based sampling

**Dependencies**: Only Python standard library
- `os` - File operations
- `math` - Mathematical functions
- `random` - Randomization and sampling

**Architecture Details**:
```python
n_embd = 16      # Embedding dimension
n_head = 4       # Number of attention heads
n_layer = 1      # Number of transformer layers
block_size = 16  # Maximum sequence length
```

## Instructions

### Basic Usage

1. **Prepare Training Data**:
   ```bash
   # The script automatically downloads a sample dataset (names.txt)
   # Or provide your own input.txt file
   ```

2. **Run Training**:
   ```bash
   cd skills/tiny-gpt/scripts
   python tiny_gpt.py
   ```

3. **Output**:
   - Training progress with loss values
   - Generated samples after training completion

### Understanding the Code

**Key Components**:

1. **Value Class** (Autograd):
   ```python
   class Value:
       # Represents a node in computation graph
       # Supports forward and backward passes
   ```

2. **Transformer Blocks**:
   ```python
   def gpt(token_id, pos_id, keys, values):
       # Attention mechanism
       # Feed-forward network
       # Residual connections
   ```

3. **Training Loop**:
   ```python
   for step in range(num_steps):
       # Forward pass
       # Loss calculation
       # Backward pass
       # Parameter update
   ```

## Use Cases

### 1. Educational Reference
- Learn transformer architecture fundamentals
- Understand autograd implementation
- Study attention mechanisms

### 2. Architecture Prototyping
- Test architectural ideas quickly
- Experiment with modifications
- Benchmark against complex implementations

### 3. Research & Experimentation
- Ablation studies on architecture components
- Understanding training dynamics
- Debugging model behavior

### 4. Interview Preparation
- Demonstrate deep ML understanding
- Explain transformers from first principles
- Discuss optimization techniques

## Example Output

```
num docs: 32033
vocab size: 27
num params: 1184

step    1 / 1000 | loss 3.2958
step    2 / 1000 | loss 3.1847
...
step 1000 / 1000 | loss 1.4523

--- inference (new, hallucinated names) ---
sample  1: karli
sample  2: jadelyn
sample  3: amiryn
...
```

## Customization

### Modify Architecture

```python
# Change model size
n_embd = 32      # Larger embeddings
n_head = 8       # More attention heads
n_layer = 2      # Deeper network

# Adjust training
num_steps = 2000  # Longer training
learning_rate = 0.001  # Different learning rate
```

### Use Your Own Data

```python
# Replace input.txt with your own text file
docs = [l.strip() for l in open('my_data.txt').read().strip().split('\n')]
```

### Experiment with Generation

```python
# Control creativity
temperature = 0.3  # More deterministic
temperature = 0.8  # More creative

# Generate longer sequences
block_size = 32    # Allow longer text
```

## Technical Details

### Autograd Implementation

The `Value` class implements automatic differentiation:
- Forward pass: Compute output and store local gradients
- Backward pass: Apply chain rule recursively

### Attention Mechanism

Multi-head self-attention implementation:
1. Query, Key, Value projections
2. Scaled dot-product attention
3. Multi-head concatenation
4. Output projection

### Optimization

Adam optimizer with:
- Beta1 = 0.85 (first moment decay)
- Beta2 = 0.99 (second moment decay)
- Linear learning rate decay

## Limitations

**By Design**:
- Small model size (for educational clarity)
- Character-level tokenization (simple but inefficient)
- Single layer (to minimize complexity)
- CPU-only (no GPU acceleration)

**Not Suitable For**:
- Production language models
- Large-scale text generation
- Real-time inference
- Commercial applications

## Related Documentation

- [AGENT.md](../../AGENT.md) - Integration with QA Nexus
- [Skills.MD](../../Skills.MD) - Skills registry overview
- [nanoGPT](https://github.com/karpathy/nanoGPT) - Original project

## Questions & Support

For questions about this skill:
1. Review the inline code comments in `tiny_gpt.py`
2. Check the original nanoGPT repository
3. See Andrej Karpathy's educational videos on transformers
4. Open GitHub issue for bugs in the QA Nexus adaptation

---

**Version**: 1.0.0  
**Last Updated**: February 14, 2026  
**License**: MIT  
**Original Author**: Andrej Karpathy  
**Adapted By**: Darshil
