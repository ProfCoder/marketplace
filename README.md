# Interactive Systems - Tutorial

## Assignment 9: Responsive Design

**Achieved Points: [__/20]**  
**Deadline: 09.07.2024 13:30**

<img src="images/assignment9_teaser.gif">

### Design Patterns

The following Design Patterns (or guidelines) are applied in this assignment:

- [ ] [Vertical Stack](https://ebookcentral.proquest.com/lib/uni-konstanz/reader.action?docID=5996435&ppg=326) (Page 306)
- [ ] [Generous Borders](https://ebookcentral.proquest.com/lib/uni-konstanz/reader.action?docID=5996435&ppg=345) (Page 325)

You can find all design patterns in the book [Designing Interfaces: Patterns for Effective Interaction Design](https://ebookcentral.proquest.com/lib/uni-konstanz/detail.action?docID=5996435)

### Tasks

In this assignment, you will make the layout of your shop responsive.

<!-- TODO Fix links -->
- [ ] [Adapt Layout to Different Screen Ratios](#adapt-layout-to-different-screen-ratios) (15 Points)
- [ ] [Make Interface Touch-Friendly](#make-interface-touch-friendly) (3 Points)
- [ ] [Present Your Store](#present-your-store) (2 Points)
- [ ] [Tag the Final Commit](#tag-the-final-commit)

### Instructions

#### Adapt Layout to Different Screen Ratios
15 Points

* Adapt the layout of your store to be responsive to provide good usability on different screen sizes.

  > 💡 To learn more about responsive web design (RWD) and how to realize it with web technologies, take a look at the tutorial slides and their references, and visit the [MDN web docs](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

* While your layout should ideally work on all realistic screen sizes, it must be usable at a width of `375px` (e.g., size of iPhone SE in Firefox/Chrome developer tools), `820px` (e.g., size of iPad Air in Chrome developer tools), and `3440px` (a common widescreen monitor width)

* For narrow viewports, make sure that no horizontal scrolling is required to access controls or information. Elements should remain at a readable size without zooming in or out.

  > 💡 Consider changing the layout to arrange elements vertically following the [Vertical Stack](https://ebookcentral.proquest.com/lib/uni-konstanz/reader.action?docID=5996435&ppg=326) design pattern.

* For wide viewports, space should be used efficiently but ensure the layout is still coherent and provides a good user experience. E.g. texts should have a maximum line length to [remain readable](https://practicaltypography.com/line-length.html).

> 💡 You can use your [browser's developer tools](https://developer.mozilla.org/en-US/docs/Glossary/Developer_Tools) to test different screen sizes. Additionally, you can view your store on your phone by exposing Angular's development server to your local network with `ng serve --host 0.0.0.0`. You can then access the site by typing `http://<ip-of-your-development-computer>:4200`. Be aware that this does not work in eduroam.

#### Make Interface Touch-Friendly
3 Points

*   Make sure your store is usable with touch controls. Control elements should be separated by enough whitespace to allow for error-free use on smartphone screens (e.g., size of iPhone SE in Firefox/Chrome developer tools).

*   To achieve this, apply the design pattern [Generous Borders](https://ebookcentral.proquest.com/lib/uni-konstanz/reader.action?docID=5996435&ppg=345).

> 💡 You can use your [browser's developer tools](https://developer.mozilla.org/en-US/docs/Glossary/Developer_Tools) to emulate touch input. Additionally, you can test your store on your phone by exposing Angular's development server to your local network with `ng serve --host 0.0.0.0`. You can then access the site by typing `http://<ip-of-your-development-computer>:4200`. Be aware that this does not work in eduroam.

#### Present Your Store
2 Points

*   Present the online store you have developed this semester in the last tutorial on 09.07./10.07 🗔🎉.
*   You do not need to present your entire online store, but only the (in your opinion) most attractive features (or the features you are most proud of).
*   During the presentation, explain at least 2 design patterns used in your design.
*   You will have a maximum of **5 minutes** for the entire presentation.

#### Tag the Final Commit

- When you are finished with the assignment, tag the final commit before the deadline with the tag `assignment9`.

> 💡 You can tag a commit in the terminal with the command `git tag -a assignment9` or in GitLab (Code -> Tags -> New tag). To push all tags to GitLab use the command `git push --tags`.

