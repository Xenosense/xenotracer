# How to contribute to Xenotracer

Hi folks! First of all, thanks for your generosity in intending to grow Xenotracer together! We really appreciate it!

As you can see, we develop a Visual Studio Code extension to visualize a `.cairo` file format. It contains Cairo programming language to run decentralized apps on top of StarkNet.

Here, we will give you several guides on how to contribute to this repository that you should know.

## How to start learning to develop the VSCode Extension code

To be honest, it was our first time developing a VSCode extension, which made us struggle. Fortunately, the VS Code developers have fantastic tutorials and documentations. You can check their website [here](https://code.visualstudio.com/api/get-started/your-first-extension).

## Issue Reporting

If you have a problem to report, first, you need to search if the issue already exists. If it is not, you can create it by selecting a suitable issue form that we have created. 

## Contribute to resolve several issues

If you find any issues that are not assigned to someone, you can try to solve them. If you have written the patch to solve them (by forking), you can create several Pull Requests (PR) by following the PR template. The core organizers will review your code to see if your code is suitable to be merged into the main branch.

Note that it will be rare for us to assign any issues to someone. We will make the repository flexible. 

## `Story-like` Issue

If you see the issues section, you will see several issues with a story-like title. Previously, we developed this repository by applying the sprint methodology. But now, we are not in the middle of a sprint anymore, so, You can solve some of them (the unassigned ones). 

Nonetheless, if you want to create an issue, you do not have to mind their format.

## Testing

You can refer to [README.md](README.md) to test the code. The test folder is located in `src/test`.

## How to request an "enhancement"

If you want to request additional features and so on, you can create an issue in the issues section. If it is impactful, someone might be able to implement it.

## How to submit changes: Pull Request

If you want to create PR, your code and PR should pay attention to these things:

- **Unit test**: Make sure that you several unit tests (at least one) to your implementation. We need these to make sure our code doesn't break.
- Your PR should have a descriptive and brief title.
- Make sure you test your code locally.

## Environment Details

You can refer them to [README.md](README.md). In addition, See `package.json` to see more details about the environment.

## Style Guide / Coding Convention

For the code format, We use `Prettier` to tidy the code. Meanwhile, you can refer to [Google Javascript Style Guide](https://google.github.io/styleguide/jsguide.html) for the coding style.  

