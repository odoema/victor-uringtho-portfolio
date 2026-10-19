# One-click publishing

After a one-time setup, any commit to `main` that changes `src/` does two jobs automatically:

1. **Rebuild victoruringtho.com.** The Action runs `node build_pages.js` and `python prerender.py`, then commits the new `docs/`. GitHub Pages republishes it within about a minute.
2. **Update the Apps Script web app.** The Action runs `clasp push`, then updates the existing deployment to a new version. The web-app URL does not change.

After that, Brian no longer needs to drag `docs/` or click "New version". Commit `src/` and the Action does the rest. Check progress under **Actions** on GitHub. A green tick means the change is live.

## One-time setup (about 10 minutes, Brian only)

### 1. Turn on the Apps Script API
Go to https://script.google.com/home/usersettings and switch on **Google Apps Script API**.

### 2. Create the login file on your own computer
You need Node.js (https://nodejs.org, LTS version). Then open Command Prompt:

```
npm install -g @google/clasp@2.4.2
clasp login
```

A browser window opens. Sign in as **odoema@gmail.com** and click **Allow**.
clasp saves a file at `C:\Users\odoem\.clasprc.json`.

### 3. Put that file into GitHub as a secret
1. Open `C:\Users\odoem\.clasprc.json` in Notepad and copy **all** of it.
2. Go to GitHub → **victor-uringtho-portfolio** → **Settings → Secrets and variables → Actions → New repository secret**.
3. For Name, enter `CLASPRC_JSON`. For Secret, paste what you copied. Then click **Add secret**.

Keep this file and secret private. Anyone holding them can edit your Apps Script projects. Never paste the contents into a chat or an email. To cut off access, revoke "clasp" at https://myaccount.google.com/permissions.

### 4. Check the GitHub settings
- **Settings → Actions → General → Workflow permissions**: choose **Read and write permissions**.
- **Settings → Pages**: the source stays **main / docs**.

### 5. First run
Go to **Actions → Publish → Run workflow**. Both jobs should turn green.

## Day to day
- **Content (text, prices, photos):** keep using the Google Sheet. Nothing changes.
- **Code changes:** commit the changed files in `src/`, either by dragging them onto the upload page or by editing on GitHub. Publishing then runs on its own.
- **Something went wrong:** open the red job under **Actions** to read the error. In Apps Script, **Deploy → Manage deployments** lists every version, and you can roll back to an earlier one there.
