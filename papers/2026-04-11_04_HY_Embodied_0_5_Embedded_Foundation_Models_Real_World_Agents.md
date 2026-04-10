# HY-Embodied-0.5: Embodied Foundation Models for Real-World Agents

**Submitted:** April 8, 2026  
**Source:** Tencent Robotics X  
**Relevance:** High (embodied foundation models)

## Overview

HY-Embodied-0.5 is a family of embodied foundation models developed by Tencent Robotics X designed to enhance core capabilities required by embodied intelligence. It bridges the gap between general Vision-Language Models (VLMs) and the demands of embodied agents.

## Motivation

**The Gap Problem**:
- General VLMs excel at semantic understanding but lack embodied capabilities
- Embodied agents need perception, reasoning, and action coordination
- Existing models don't scale to real-world applications

## Core Capabilities

The paper focuses on enhancing these embodied capabilities:

1. **Perception**: Understanding environment from visual and multimodal inputs
2. **Reasoning**: Spatial reasoning for planning and decision-making
3. **Action**: Coordinating execution of plans in physical environments
4. **Integration**: Seamless integration of perception, reasoning, and action

## Model Architecture

**Foundational Design**:
- Vision-Language backbone for multimodal understanding
- Spatial reasoning modules for environment modeling
- Action generation and planning components
- Execution and feedback mechanisms

**Key Components**:
- **Visual Encoder**: Processes visual observations
- **Spatial Reasoner**: Models spatial relationships and dynamics
- **Action Planner**: Generates plans based on spatial understanding
- **Controller**: Executes actions in physical world

## Training Approach

- **Multimodal Pre-training**: Vision, language, and action data
- **Embodied Supervision**: Learning from embodied experiences
- **Reinforcement Learning**: Optimizing for real-world performance
- **Sim-to-Real**: Bridging simulation and reality gap

## Capabilities Demonstrated

1. **Navigation**: Moving through environments safely
2. **Manipulation**: Interacting with objects
3. **Interaction**: Communicating with humans and environment
4. **Learning**: Adapting to new situations

## Relevance to Spatial AGI

This work is essential for Spatial AGI because:
- Embodied intelligence is a key component of AGI
- Foundation models provide scalability and transferability
- Focus on real-world applications is critical for AGI deployment
- Combines perception, reasoning, and action

## Potential Applications

- Household robots
- Service robots
- Industrial automation
- Assistive robots

## Challenges

- Real-world generalization
- Long-term autonomy
- Safety guarantees
- Resource efficiency

## Innovation

- **Comprehensive Capability**: Covers full embodied lifecycle
- **Foundation Model**: Scalable architecture
- **Real-World Focus**: Tackles actual deployment challenges
- **Multi-modal Integration**: Seamlessly combines different modalities
