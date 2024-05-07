# Interactive Systems - Tutorial

## Assignment 4: Infinite Product List

**Achieved Points: [__/10]**  
**Deadline: 14.05.2024 13:30**

### Design Patterns

The following Design Patterns are applied in this assignment:

- [ ] [Infinite List](https://ebookcentral.proquest.com/lib/uni-konstanz/reader.action?docID=5996435&ppg=342) (Page 322)
- [ ] [Loading Indicator](https://ebookcentral.proquest.com/lib/uni-konstanz/reader.action?docID=5996435&ppg=348) (Page 328)

You can find all design patterns in the book [Designing Interfaces: Patterns for Effective Interaction Design](https://ebookcentral.proquest.com/lib/uni-konstanz/detail.action?docID=5996435)

### Tasks

In this assignment, you will make the product list dynamic and allow the user to load more items on request.

- [ ] [Implement Infinite List](#implement-infinite-list) (6 Points)
- [ ] [Design and Implement Loading Indicator](#design-and-implement-loading-indicator) (4 Points)
- [ ] [Bonus: Load on Scroll](#bonus-load-on-scroll) (+2 Points)
- [ ] [Tag the Final Commit](#tag-the-final-commit)

<img src="images/loading.mp4"  width="600">

### Instructions

> 💡 We added new functions in the `ProductService` (`product.service.ts`). Instead of `getAllProductMetadata()`, you should now use `getInitialProductMetadata()` and `getNextProductMetadata()`.

#### Implement Infinite List

- Use the new `getInitialProductMetadata(n)` method of the `ProductService` to only load the first chunk of `n` items when the page is first loaded. Find a reasonable amount of items to be loaded, as described in the design pattern [Infinite List](https://ebookcentral.proquest.com/lib/uni-konstanz/reader.action?docID=5996435&ppg=342).
- Add a button below the list/grid view. When the user clicks on it, the new `getNextProductMetadata(n)` function should be called to load the next chunk of `n` items.
- For your design, apply the design pattern [Infinite List](https://ebookcentral.proquest.com/lib/uni-konstanz/reader.action?docID=5996435&ppg=342).

#### Design and Implement Loading Indicator

- Create an animated loading indicator.
- While the next items are being loaded, show the loading indicator at the end of the list. When the loading process is finished, hide the loading indicator again.
- While the items are being loaded and the loading indicator is shown, the user should not be able to request more items.
- For your design, apply the design pattern [Loading Indicator](https://ebookcentral.proquest.com/lib/uni-konstanz/reader.action?docID=5996435&ppg=348).

#### Bonus: Load on Scroll

- This task is optional. If you implement this feature, you can get up to 2 additional points.
- Instead of using a "Load more" button, load more items when the user scrolls down to the end of the list.

#### Tag the Final Commit

- When you are finished with the assignment, tag the final commit before the deadline with the tag `assignment4`.

> 💡 You can tag a commit in the terminal with the command `git tag -a assignment4` or in GitLab (Code -> Tags -> New tag). To push all tags to GitLab use the command `git push --tags`.
