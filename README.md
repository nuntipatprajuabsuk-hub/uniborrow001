# UniBorrow

UniBorrow is a university demonstration project for sharing and borrowing useful items between students. It is built with plain HTML, CSS, and JavaScript and stores demo data in the browser, so it can run on GitHub Pages without a backend.

## Main features

- Register, log in, log out, and edit a student profile
- Browse, search, and filter items
- Create, edit, pause, resume, and delete owned listings
- Upload and preview a small item image
- Send, approve, decline, and cancel borrowing requests
- Mark an item as returned and let the owner confirm the return
- Track pending requests, active loans, and borrowing history
- Receive in-app notifications
- Reset the project to its original demo data
- Responsive navigation for desktop and mobile

## Demo accounts

All sample accounts use the password **demo1234**.

| User | Email | Useful for testing |
| --- | --- | --- |
| Tawan S. | tawan@uniborrow.ac.th | Owns several items and has incoming requests |
| Maya P. | maya@uniborrow.ac.th | Owns study items and has an active borrowing |
| Niran K. | niran@uniborrow.ac.th | Has a pending request for Tawan's drill |

Start with Tawan to approve Niran's request, then log in as Niran to test the return flow.

## Run locally

The site can be opened directly from index.html. A local static server is recommended during development:

~~~bash
python -m http.server 8000
~~~

Then open http://localhost:8000.

No dependency installation is required. Node.js 18 or newer is only needed for the automated checks.

## Verify the project

~~~bash
npm run verify
~~~

This checks JavaScript syntax, local links, duplicate HTML IDs, and the full request → approval → return data flow.

## Publish with GitHub Pages

1. Create a GitHub repository and upload all files in this folder.
2. Open **Settings → Pages** in the repository.
3. Select **Deploy from a branch**.
4. Choose the main branch and the / (root) folder.
5. Save and wait for the GitHub Pages URL.

The root index.html automatically opens the main UniBorrow page.

## Project structure

~~~text
uniborrow/
├── index.html
├── client/
│   ├── css/        # Shared and page-specific styling
│   ├── img/        # Sample item artwork
│   ├── js/         # Store, UI components, page rendering, bootstrap
│   └── pages/      # Website pages
├── scripts/        # Project integrity check
└── tests/          # Data workflow tests
~~~

## Important limitation

This project is intentionally client-only. Accounts, password demo hashes, uploaded images, and transactions are stored in localStorage on the current browser. This is appropriate for a university demonstration using fictional data, but it is not secure or suitable for real personal information. A production version would require server-side authentication, a database, access control, and secure file storage.
