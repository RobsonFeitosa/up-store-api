import dayjs from 'dayjs'

import { ICreateTimeDiscountDTO } from '@modules/products/dtos/ICreateTimeDiscountDTO'
const now = dayjs()
export const timeDiscountData: ICreateTimeDiscountDTO[] = [
  {
    startDate: now.add(1, 'day').toDate(),
    endDate: now
      .add(43, 'day')
      .add(3, 'hour')
      .add(20, 'minute')
      .add(20, 'second')
      .toDate(),
    discount: 30,
    status: 'actived',
  },
  {
    startDate: now.add(1, 'day').toDate(),
    endDate: now
      .add(65, 'day')
      .add(2, 'hour')
      .add(15, 'minute')
      .add(11, 'second')
      .toDate(),
    discount: 10,
    status: 'actived',
  },
  {
    startDate: now.add(1, 'day').toDate(),
    endDate: now
      .add(84, 'day')
      .add(1, 'hour')
      .add(11, 'minute')
      .add(31, 'second')
      .toDate(),
    discount: 5,
    status: 'actived',
  },
  {
    startDate: now.add(1, 'day').toDate(),
    endDate: now
      .add(28, 'day')
      .add(4, 'hour')
      .add(35, 'minute')
      .add(15, 'second')
      .toDate(),
    discount: 5,
    status: 'actived',
  },
  {
    startDate: now.add(1, 'day').toDate(),
    endDate: now
      .add(47, 'day')
      .add(6, 'hour')
      .add(42, 'minute')
      .add(45, 'second')
      .toDate(),
    discount: 5,
    status: 'actived',
  },
]
