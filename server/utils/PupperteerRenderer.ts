import {
  launch, LaunchOptions, PDFOptions,
} from 'puppeteer';

export interface PuppeteerOptions {
  launch?: LaunchOptions;
  pdf?: PDFOptions;
}

export class PuppeteerRenderer {
  private options: PuppeteerOptions = {}
;

  public defaultOptions: PuppeteerOptions = {
    pdf: {
      format: 'a4',
    },
  };

  public async renderFromHtml(html: string) {
    const { browser, page } = await this.getBrowserAndPage();

    await page.setContent(html, {});

    const pdfOptions: PDFOptions = this.options?.pdf ?? {};
    const buffer = await page.pdf({
      ...this.defaultOptions,
      ...pdfOptions,
    });

    await browser.close();

    return buffer;
  }

  /**
   *
   * @param path The file path to save the PDF to. If path is a relative path,
   * then it is resolved relative to current working directory. If no path is provided,
   *  the PDF won't be saved to the disk.
   */
  public async renderFromHtmlToFile(html: string, path: string) {
    const { browser, page } = await this.getBrowserAndPage();

    await page.setContent(html, {});

    const pdfOptions: PDFOptions = this.options?.pdf ?? {};
    await page.pdf({
      ...this.defaultOptions,
      ...pdfOptions,
      path,
    });
    await browser.close();
  }

  private async getBrowserAndPage() {
    const browser = await launch(this.options?.launch ?? {});
    const page = await browser.newPage();

    return { browser, page };
  }
}
