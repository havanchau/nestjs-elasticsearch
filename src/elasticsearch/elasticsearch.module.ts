import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule as Elasticsearch } from '@nestjs/elasticsearch';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  imports: [
    ConfigModule,
    Elasticsearch.register({
      node: 'http://localhost:9200',
    }),
  ],
  providers: [ElasticsearchService],
  exports: [Elasticsearch, ElasticsearchService],
})
export class ElasticsearchModule {}
