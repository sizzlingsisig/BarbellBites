import 'dotenv/config'
import { spawn } from 'node:child_process'
import path from 'node:path'

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`
  const arg = process.argv.find((value) => value.startsWith(prefix))
  return arg ? arg.slice(prefix.length) : undefined
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForHealth(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        return
      }
    } catch {
      // Server may still be booting.
    }

    await sleep(500)
  }

  throw new Error(`API did not become ready within ${timeoutMs}ms (${url})`)
}

function runShellCommand(command: string, cwd: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    })

    child.on('error', reject)
    child.on('close', (code) => resolve(code ?? 1))
  })
}

async function run(): Promise<void> {
  const suite = getArg('suite')
  const envName = getArg('env') ?? 'Development'

  if (!suite) {
    throw new Error('Missing required --suite argument (example: --suite=V1/Smoke)')
  }

  const backendDir = process.cwd()
  const brunoDir = path.join(backendDir, 'BarbellBites')

  const port = process.env.PORT ?? '3000'
  const healthUrl = process.env.TEST_HEALTH_URL ?? `http://127.0.0.1:${port}/api/v1/health/db`

  console.log(`[TEST] Starting API server for Bruno suite ${suite}...`)
  await import('../index.js')

  await waitForHealth(healthUrl, 30000)
  console.log(`[TEST] API ready at ${healthUrl}`)

  const command = `npx bru run ${suite} -r --env ${envName} --bail --noproxy`
  const exitCode = await runShellCommand(command, brunoDir)

  if (exitCode !== 0) {
    process.exitCode = exitCode
  }

  process.exit(process.exitCode ?? 0)
}

run().catch((error) => {
  console.error('[TEST] Bruno automation failed:', error)
  process.exit(1)
})
