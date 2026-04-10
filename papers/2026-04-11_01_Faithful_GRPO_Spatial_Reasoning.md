# Faithful GRPO: Improving Visual Spatial Reasoning in Multimodal Language Models via Constrained Policy Optimization

**Submitted:** April 9, 2026  
**Source:** arXiv:2604.XXXXX (not available yet)  
**Relevance:** High (spatial reasoning in VLMs)

## Overview

This paper addresses a critical issue in Multimodal Language Models (MLMs): the inconsistency between their visual reasoning and final answers. The authors systematically study this phenomenon across seven challenging real-world spatial reasoning benchmarks and find it affects contemporary models.

## Key Problems Identified

1. **Inconsistency**: Visual reasoning is frequently inconsistent with the final answer
2. **Poor Grounding**: Visual reasoning is poorly grounded in visual evidence
3. **Cross-Benchmark Impact**: This phenomenon affects multiple real-world benchmarks

## Proposed Solution

**Faithful GRPO (Group Relative Policy Optimization)**: A constrained policy optimization framework that enforces consistency between visual spatial reasoning and final answers.

### Technical Approach

- **Constrained Policy Optimization**: Adds constraints to the optimization objective
- **Faithfulness Loss**: Penalizes inconsistencies between intermediate reasoning and final answers
- **Multi-Benchmark Evaluation**: Tested on 7 spatial reasoning benchmarks

## Key Contributions

1. **Systematic Analysis**: First comprehensive study of visual spatial reasoning inconsistency in VLMs
2. **Faithful GRPO Framework**: Novel constrained optimization for enforcing reasoning consistency
3. **Benchmark Evaluation**: Validated on 7 diverse real-world spatial reasoning tasks

## Potential Impact

- Directly improves VLM reliability for spatial reasoning tasks
- Provides methodology that can be applied to other multimodal reasoning problems
- Opens new research direction for grounding visual reasoning

## Relevance to Spatial AGI

This work is highly relevant to Spatial AGI because:
- Addresses fundamental limitation of VLMs in spatial reasoning
- Provides mechanisms for improving reliability of spatial decision-making
- Has direct applications in embodied AI navigation and manipulation

## Challenges

- Requires careful calibration of the faithfulness loss
- May have performance trade-offs on simpler tasks
- Needs further investigation on long-horizon spatial reasoning

## Future Directions

- Adapt to long-horizon tasks
- Investigate sample efficiency
- Study generalization across different spatial reasoning tasks
