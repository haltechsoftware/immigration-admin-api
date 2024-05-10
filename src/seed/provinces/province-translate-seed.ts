import { count } from 'drizzle-orm';
import { db } from '../main';
import { provinceTranslate } from '../../../src/modules/checkpoints/entities';

export default async () => {
  const total = await db.select({ value: count() }).from(provinceTranslate);

  if (total[0].value < 50) {
    await db.insert(provinceTranslate).values([
      {
        id: 1,
        province_id: 1,
        name: 'Vientiane capital',
        slug: 'vientiane-capital',
        description: 'Modern City, Cultural Radiance',
        lang: 'en'
      },
      {
        id: 2,
        province_id: 1,
        name: 'ນະຄອນຫລວງ ວຽງຈັນ',
        slug: 'ນະຄອນຫລວງ-ວຽງຈັນ',
        description: 'ທົ່ວປະເທດ, ທາງກາງຂອງມືດຕະ',
        lang: 'lo'
      },
      
      {
        id: 3,
        province_id: 1,
        name: '萬象資本',
        slug: '萬象資本',
        description: '现代都市，文化之光',
        lang: 'zh_cn'
      },
      //ແຂວງໄຊສົມບູນ
      {
        id: 4,
        province_id: 2,
        name: 'Xaisomboun Province',
        slug: 'xaisomboun-province',
        description: 'Beautiful Mountains, Cultural Homeland',
        lang: 'en'
      },
      {
        id: 5,
        province_id: 2,
        name: 'ແຂວງ ໄຊສົມບູນ',
        slug: 'ແຂວງ-ໄຊສົມບູນ',
        description: 'ພູເຂົາແລະແມ່ນ້ໍາທີ່ສວຍງາມ, ບ້ານເກີດຂອງວັດທະນະທໍາ',
        lang: 'lo'
      },
      
      {
        id: 6,
        province_id: 2,
        name: '賽桑邦省',
        slug: '賽桑邦省',
        description: '山清水秀，文化之乡',
        lang: 'zh_cn'
      },
      //ແຂວງອັດຕະປື
      {
        id: 7,
        province_id: 3,
        name: 'Attapeu Province',
        slug: 'attapeu-province',
        description: 'Green Province, Ecological Joy',
        lang: 'en'
      },
      {
        id: 8,
        province_id: 3,
        name: 'ແຂວງ ອັດຕະປື',
        slug: 'ແຂວງ-ອັດຕະປື',
        description: 'ຊັບວິຕິບໍ່ມີສາມາດ, ຜູ້ສະໄຫມເພື່ອມັກສັງຄົນພາຍໃນທາງ',
        lang: 'lo'
      },
      
      {
        id: 9,
        province_id: 3,
        name: '阿达普省',
        slug: '阿达普省',
        description: '绿色之州，生态之乐',
        lang: 'zh_cn'
      },
      //ແຂວງບໍ່ແກ້ວ
      {
        id: 10,
        province_id: 4,
        name: 'Bokeo Province',
        slug: 'bokeo-province',
        description: 'Border Beauty, Diverse Journeys',
        lang: 'en'
      },
      {
        id: 11,
        province_id: 4,
        name: 'ແຂວງ ບໍ່ແກ້ວ',
        slug: 'ແຂວງ-ບໍ່ແກ້ວ',
        description: 'ດິນປາກັນ, ຄວາມສະຫລາຍກວ່າຄົນກັນ',
        lang: 'lo'
      },
      
      {
        id: 12,
        province_id: 4,
        name: '博胶省',
        slug: '博胶省',
        description: '边境之美，多样之旅',
        lang: 'zh_cn'
      },
      //ແຂວງບໍລິຄຳໄຊ
      {
        id: 13,
        province_id: 5,
        name: 'Xayabuli Province',
        slug: 'xayabuli-province',
        description: "Lake Views, Mountain Scenery, Nature's Blessing",
        lang: 'en'
      },
      {
        id: 14,
        province_id: 5,
        name: 'ແຂວງ ໄຊຍະບູລີ',
        slug: 'ແຂວງ-ໄຊຍະບູລີ',
        description: 'ນໍ້າຊື່ອຽຄວາມສະຫລາຍ, ເມືອງເທດຂອງມືດຕະ',
        lang: 'lo'
      },
      
      {
        id: 15,
        province_id: 5,
        name: '沙耶武里省',
        slug: '沙耶武里省',
        description: '湖光山色，自然之恩',
        lang: 'zh_cn'
      },
      //ແຂວງຈຳປາສັກ
      {
        id: 16,
        province_id: 6,
        name: 'Champasak Province',
        slug: 'champasak-province',
        description: "Land of Rivers, History's Emotion",
        lang: 'en'
      },
      {
        id: 17,
        province_id: 6,
        name: 'ແຂວງ ຈຳປາສັກ',
        slug: 'ແຂວງ-ຈຳປາສັກ',
        description: 'ບູນຕົກລົດ, ຜູ້ສະໄຫມໃນຊາວສິ້ນຄົມ',
        lang: 'lo'
      },
      
      {
        id: 18,
        province_id: 6,
        name: '佔巴塞省',
        slug: '佔巴塞省',
        description: '水乡之美，历史之情',
        lang: 'zh_cn'
      },
      //ແຂວງຫົວພັນ
      {
        id: 19,
        province_id: 7,
        name: 'Houaphanh Province',
        slug: 'houaphanh-province',
        description: "",
        lang: 'en'
      },
      {
        id: 20,
        province_id: 7,
        name: 'ແຂວງ ຫົວພັນ',
        slug: 'ແຂວງ-ຫົວພັນ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 21,
        province_id: 7,
        name: '華潘省',
        slug: '華潘省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງຄຳມ່ວນ
      {
        id: 22,
        province_id: 8,
        name: 'Khammouane Province',
        slug: 'khammouane-province',
        description: "",
        lang: 'en'
      },
      {
        id: 23,
        province_id: 8,
        name: 'ແຂວງ ຄຳມ່ວນ',
        slug: 'ແຂວງ-ຄຳມ່ວນ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 24,
        province_id: 8,
        name: '甘蒙省',
        slug: '甘蒙省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງຫຼວງນໍ້າທາ
      {
        id: 25,
        province_id: 9,
        name: 'Luang Namtha Province',
        slug: 'luang-namtha-province',
        description: "",
        lang: 'en'
      },
      {
        id: 26,
        province_id: 9,
        name: 'ແຂວງ ຫຼວງນໍ້າທາ',
        slug: 'ແຂວງ-ຫຼວງນໍ້າທາ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 27,
        province_id: 9,
        name: '瑯南塔省',
        slug: '瑯南塔省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງຫຼວງພະບາງ
      {
        id: 28,
        province_id: 10,
        name: 'Luang Prabang Province',
        slug: 'luang-prabang-province',
        description: "",
        lang: 'en'
      },
      {
        id: 29,
        province_id: 10,
        name: 'ແຂວງ ຫຼວງພະບາງ',
        slug: 'ແຂວງ-ຫຼວງພະບາງ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 30,
        province_id: 10,
        name: '瑯勃拉邦省',
        slug: '瑯勃拉邦省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງອຸດົມໄຊ
      {
        id: 31,
        province_id: 11,
        name: 'Oudomxay Province',
        slug: 'oudomxay-province',
        description: "",
        lang: 'en'
      },
      {
        id: 32,
        province_id: 11,
        name: 'ແຂວງ ອຸດົມໄຊ',
        slug: 'ແຂວງ-ອຸດົມໄຊ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 33,
        province_id: 11,
        name: '烏多姆賽省',
        slug: '烏多姆賽省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງຜົ້ງສາລີ
      {
        id: 34,
        province_id: 12,
        name: 'Phongsaly Province',
        slug: 'phongsaly-province',
        description: "",
        lang: 'en'
      },
      {
        id: 35,
        province_id: 12,
        name: 'ແຂວງ ຜົ້ງສາລີ',
        slug: 'ແຂວງ-ຜົ້ງສາລີ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 36,
        province_id: 12,
        name: '豐沙裡省',
        slug: '豐沙裡省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງສາລະວັນ
      {
        id: 37,
        province_id: 13,
        name: 'Salavan Province',
        slug: 'salavan-province',
        description: "",
        lang: 'en'
      },
      {
        id: 38,
        province_id: 13,
        name: 'ແຂວງ ສາລະວັນ',
        slug: 'ແຂວງ-ສາລະວັນ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 39,
        province_id: 13,
        name: '沙撈越省',
        slug: '沙撈越省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງສະຫວັນນະເຂດ
      {
        id: 40,
        province_id: 14,
        name: 'Savannakhet Province',
        slug: 'savannakhet-province',
        description: "",
        lang: 'en'
      },
      {
        id: 41,
        province_id: 14,
        name: 'ແຂວງ ສະຫວັນນະເຂດ',
        slug: 'ແຂວງ-ສະຫວັນນະເຂດ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 42,
        province_id: 14,
        name: '沙灣拿吉省',
        slug: '沙灣拿吉省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງເຊກອງ
      {
        id: 43,
        province_id: 15,
        name: 'Sekong Province',
        slug: 'sekong-province',
        description: "",
        lang: 'en'
      },
      {
        id: 44,
        province_id: 15,
        name: 'ແຂວງ ເຊກອງ',
        slug: 'ແຂວງ-ເຊກອງ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 45,
        province_id: 15,
        name: '色貢省',
        slug: '色貢省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງຊຽງຂວາງ
      {
        id: 46,
        province_id: 16,
        name: 'Xiangkhouang Province',
        slug: ' xiangkhouang-province',
        description: "",
        lang: 'en'
      },
      {
        id: 47,
        province_id: 16,
        name: 'ແຂວງ ຊຽງຂວາງ',
        slug: 'ແຂວງ-ຊຽງຂວາງ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 48,
        province_id: 16,
        name: '川壙省',
        slug: '川壙省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງບໍລິຄຳໄຊ
      {
        id: 49,
        province_id: 17,
        name: 'Borikhamxay Province',
        slug: 'borikhamxay-province',
        description: "",
        lang: 'en'
      },
      {
        id: 50,
        province_id: 17,
        name: 'ແຂວງ ບໍລິຄຳໄຊ',
        slug: 'ແຂວງ-ບໍລິຄຳໄຊ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 51,
        province_id: 17,
        name: '博里坎賽省',
        slug: '博里坎賽省',
        description: '',
        lang: 'zh_cn'
      },
      //ແຂວງວຽງຈັນ
      {
        id: 52,
        province_id: 18,
        name: 'Vientiane Province',
        slug: 'vientiane Province-province',
        description: "",
        lang: 'en'
      },
      {
        id: 53,
        province_id: 18,
        name: 'ແຂວງ ວຽງຈັນ',
        slug: 'ແຂວງ-ວຽງຈັນ',
        description: '',
        lang: 'lo'
      },
      
      {
        id: 54,
        province_id: 18,
        name: '萬象省',
        slug: '萬象省',
        description: '',
        lang: 'zh_cn'
      },
      
    ]);
  }
};