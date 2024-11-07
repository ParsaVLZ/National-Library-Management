import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { BookEntity } from '../../book/entities/book.entity';
import { EntityName } from 'src/common/enums/entity-name.enum';

@Entity(EntityName.ORDER)
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;
  @ManyToOne(() => BookEntity)
  book: BookEntity;
  @Column('int')
  quantity: number;
  @Column('decimal')
  totalPrice: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;
  @Column({ default: 'pending' })
  status: string;
}
