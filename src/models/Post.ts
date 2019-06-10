import {
    BelongsTo,
    Column,
    Model,
    Table,
    DataType,
    ForeignKey,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt
  } from "sequelize-typescript";
  import { User } from "./User";
  
  @Table({
    tableName: "post",
    timestamps: true,
    charset: "utf8",
    collate: "utf8_general_ci"
  })
  export class Post extends Model<Post> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @Column({
      type: DataType.STRING,
      allowNull: false
    })
    content: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true
    })
    image: string;
  
    @ForeignKey(() => User)
    @Column
    userId: number;
  
    @BelongsTo(() => User)
    user?: User;
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
  }
  