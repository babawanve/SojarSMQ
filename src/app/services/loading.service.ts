import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  readonly visible = signal(false);
  readonly closing = signal(false);
  readonly progress = signal(0);
  readonly message = signal('Loading');
  private finishTimer?: ReturnType<typeof setTimeout>;
  private closeTimer?: ReturnType<typeof setTimeout>;

  start(message = 'Loading') {
    this.clearTimers();
    this.message.set(message);
    this.closing.set(false);
    this.progress.set(0);
    this.visible.set(true);
    requestAnimationFrame(() => this.progress.set(8));
  }

  update(progress: number, message?: string) {
    this.progress.set(Math.max(0, Math.min(100, progress)));
    if (message) this.message.set(message);
  }

  finish() {
    this.progress.set(100);
    clearTimeout(this.finishTimer);
    clearTimeout(this.closeTimer);
    this.finishTimer = setTimeout(() => {
      this.closing.set(true);
      this.closeTimer = setTimeout(() => {
        this.visible.set(false);
        this.closing.set(false);
        this.progress.set(0);
      }, 260);
    }, 180);
  }

  private clearTimers() {
    clearTimeout(this.finishTimer);
    clearTimeout(this.closeTimer);
  }
}
