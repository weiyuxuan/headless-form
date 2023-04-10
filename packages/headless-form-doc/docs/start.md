---
title: 快速上手
order: 2
---

# 快速上手

headless-form 中：

1. `useFormProvider` 提供了表单状态 Provider
2. `useForm` 提供了表单层级状态的抽象
3. `useField` 提供了表单字段层级的抽象

## 基础表单（Hooks Only）

这个最基础的例子展示了 `useFormProvider` / `useForm` / `useField` 这三个 hooks 如何去创建一个表单，并管理表单值。

<code src="./examples/start/demo1.tsx"></code>

## 基础表单（手动封装 InputField）

这个最基础的例子展示了如何利用 `useField` hook 来创建一个可复用的 `InputField` 组件。

<code src="./examples/start/demo2.tsx"></code>
