---
name: Feature request
about: Describe project feature to be added
title: feature/FeatureName
labels: enhancement
assignees: ''
type: Feature

---

name: Feature Request
description: Suggest a new feature or improvement.
title: "[Feature]: "
labels:
  - enhancement
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to suggest an improvement!

  - type: textarea
    id: problem
    attributes:
      label: Problem
      description: What problem are you trying to solve?
      placeholder: Describe the pain point or limitation.
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: Describe your proposed feature or improvement.
      placeholder: Explain how you'd like it to work.
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Have you considered any alternative solutions?
      placeholder: List any alternatives you've thought about.

  - type: textarea
    id: use_case
    attributes:
      label: Use Case
      description: How would this feature be used?
      placeholder: Describe a real-world scenario.
    validations:
      required: true

  - type: textarea
    id: additional_context
    attributes:
      label: Additional Context
      description: Add screenshots, mockups, links, or anything else that helps.

  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      options:
        - label: I searched existing issues before creating this request.
          required: true
        - label: This request describes a single feature or improvement.
          required: true
