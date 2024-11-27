import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);

    await this.elasticsearchService.indexDocument({
      index: 'users',
      id: savedUser.id.toString(),
      body: {
        name: savedUser.name,
        email: savedUser.email,
      },
    });

    return savedUser;
  }

  async search(keyword: string): Promise<any> {
    const result = await this.elasticsearchService.searchDocuments({
      index: 'users',
      query: {
        multi_match: {
          query: keyword,
          fields: ['name', 'email'],
        },
      },
      size: 100,
    });

    return result.map((hit: any) => hit._source);
  }
}
