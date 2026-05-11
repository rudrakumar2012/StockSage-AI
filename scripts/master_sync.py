import os
import time
import subprocess
import sys
from datetime import datetime


def run_script(script_name):
    print(f"\n{'='*60}")
    print(f"[MASTER] Starting: {script_name}")
    print(f"{'='*60}")

    process = subprocess.Popen([sys.executable, f"scripts/{script_name}"],
                             stdout=sys.stdout,
                             stderr=sys.stderr)
    process.wait()

    if process.returncode == 0:
        print(f"\n[MASTER] Successfully completed: {script_name}")
    else:
        print(f"\n[MASTER] Error in {script_name} (Exit code: {process.returncode})")
    return process.returncode == 0


def main():
    print(f"\n[MASTER] Data Pipeline initialized at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # 1. Market Sync (Fetch prices and setup DB) — must succeed
    if not run_script("market_sync.py"):
        print("[MASTER] Critical Failure in Market Sync. Aborting pipeline.")
        return

    # 2. FinBERT Sentiment (Financial NLP analysis)
    run_script("finbert_analyzer.py")

    # 3. Alpha Scanner (Multi-factor signal generation)
    run_script("alpha_scanner.py")

    # 4. Backtester (Compute historical win rates for confidence calibration)
    run_script("backtester.py")

    print(f"\n{'='*60}")
    print(f"[MASTER] Pipeline execution finished. All systems green.")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()