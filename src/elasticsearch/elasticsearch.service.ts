import { Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(private readonly esService: NestElasticsearchService) {}

  async indexDocument({ index, id, body }: { index: string; id?: string; body: object }) {
    try {
      const result = await this.esService.index({
        index,
        id,
        body,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkIndexDocuments(
    index: string,
    documents: { id: string; body: object }[],
  ) {
    const body = documents.flatMap((doc) => [
      { index: { _index: index, _id: doc.id } },
      doc.body,
    ]);

    return this.esService.bulk({ refresh: true, body });
  }

  async deleteDocument(index: string, id: string) {
    return this.esService.delete({
      index,
      id,
    });
  }

  async searchDocuments({
    index,
    query,
    size = 10,
  }: {
    index: string;
    query: object;
    size?: number;
  }): Promise<any> {
    try {
      const result = await this.esService.search({
        index,
        body: {
          query,
        },
        size,
      });
  
      return result.hits.hits;
    } catch (error) {
      throw error;
    }
  }
  
}
