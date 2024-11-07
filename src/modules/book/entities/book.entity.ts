import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { LibraryEntity } from '../../library/entities/library.entity';
import { EntityName } from 'src/common/enums/entity-name.enum';

@Entity(EntityName.BOOK)
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  bookId: string;
  @Column()
  title: string;
  @Column()
  author: string;
  @Column()
  price: number;
  @Column()
  quantity: number;
  @Column()
  description: string;
  @ManyToOne(() => LibraryEntity, (library) => library.books)
  library: LibraryEntity;
}
