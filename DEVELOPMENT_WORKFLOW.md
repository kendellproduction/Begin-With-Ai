# Development Workflow - BeginningWithAi

## Daily Development Routine

### Before Starting Each Session
```bash
npm run dev-session-start
```
This will:
- Check for dependency corruption
- Verify build works
- Start the development server safely

### If You Get Corruption Errors
```bash
npm run fix-corruption
```
This safely moves broken node_modules and reinstalls fresh.

## Safe Development Practices

### ✅ DO:
- Always run commands from project root
- Let npm installs complete fully
- Use `npm ci` when you have a lock file
- Close IDE during major dependency changes
- Run `npm run health-check` before important changes

### ❌ DON'T:
- Interrupt npm installs with Ctrl+C
- Run multiple npm commands simultaneously
- Delete node_modules manually (use scripts instead)
- Install packages while dev server is running

## Quick Fix Commands

| Issue | Command |
|-------|---------|
| Corruption | `npm run fix-corruption` |
| General issues | `npm run clean-install` |
| Daily startup | `npm run dev-session-start` |
| Health check | `npm run health-check` |

## Emergency Recovery
If everything breaks:
```bash
mv node_modules node_modules_emergency_backup
rm package-lock.json
npm cache clean --force
npm install
npm start
``` 