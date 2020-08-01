import { UploadedFile } from 'express-fileupload';
import Category from '../../server/models/ticket/Category';
import CategoryService from '../../server/services/ticket/CategoryService';
import GroupSeed from '../seeds/GroupSeed';
import PrioritySeed from '../seeds/PrioritySeed';
import SlaSeed from '../seeds/SlaSeed';
import StatusSeed from '../seeds/StatusSeed';
import CategoryField from '~/server/models/ticket/CategoryField';

describe('CategoryService', function () {
  this.timeout(10_000);
  it('Get Categories', async () => {
    await CategoryService.getCategories();
  });

  it('Create a new category', async () => {
    const sla = await new SlaSeed().init();
    const category = Category.create();
    category.name = 'Test';
    category.defaultGroup = await new GroupSeed().init();
    category.defaultStatus = await new StatusSeed().init();
    category.defaultPriority = await new PrioritySeed().init();
    category.description = 'description';
    category.sla = sla!;

    await CategoryService.create(category);
  });

  it('Crete a new category with father', async () => {
    const sla = await new SlaSeed().init();
    const father = await Category.findOne();
    const category = Category.create();
    category.defaultGroup = await new GroupSeed().init();
    category.defaultStatus = await new StatusSeed().init();
    category.defaultPriority = await new PrioritySeed().init();
    category.name = 'Test';
    category.father = father!;
    category.description = 'description';
    category.sla = sla!;

    await CategoryService.create(category);
  });

  it('Show full name', async () => {
    const category = await Category.findOne();
    /* eslint-disable-next-line */
    console.log(category!.fullName)
  });

  it('Edit category', async () => {
    const category = await Category.findOne();
    category!.name = 'test name';
    await CategoryService.edit(category!.id, category!);
  });

  it('Create a new category with fields', async () => {
    const sla = await new SlaSeed().init();
    const field1 = CategoryField.create({
      text: 'text of field',
      min: 0,
      max: 5,
    });
    const category = Category.create();
    category.defaultGroup = await new GroupSeed().init();
    category.defaultStatus = await new StatusSeed().init();
    category.defaultPriority = await new PrioritySeed().init();
    category.description = 'description';
    category.name = 'test';
    category.fields = [field1];
    category.sla = sla!;

    await CategoryService.create(category);
  });

  it('Get all categories', async () => {
    await CategoryService.getCategories();
  });

  it('Get one category', async () => {
    const category = await Category.findOne();
    await CategoryService.getOne(category!.name);
  });

  it('Get subs', async () => {
    const category = await Category.findOne();
    await CategoryService.getSubsForCategory(category!.id);
  });

  it('Should update a image to category', async function () {
    this.timeout(5000);
    const category = await Category.findOne();
    const image = {
      name: 'categoryImage',
      data: Buffer.from(''),
      mimetype: 'image/png',
    } as UploadedFile;
    await CategoryService.setImage(category!.id, image);
  });

  it('Should return a image from category', async () => {
    const category = await Category.findOne();
    await CategoryService.getImage(category!.id);
  });
});
