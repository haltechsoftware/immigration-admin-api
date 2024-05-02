import { count } from 'drizzle-orm';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { permissions } from 'src/modules/users/entities';
import { db } from '../main';

export default async () => {
  const total = await db.select({ value: count() }).from(permissions);

  if (total[0].value < 34) {
    await db.insert(permissions).values([
      {
        id: 1,
        name: `${PermissionGroup.User}:${PermissionName.Read}`,
        group_name: PermissionGroup.User,
        description: 'ສາມາດເບິ່ງຂໍ້ມຼນຜູ້ໃຊ້ໃນລະບົບໄດ້',
      },
      {
        id: 2,
        name: `${PermissionGroup.User}:${PermissionName.Write}`,
        group_name: PermissionGroup.User,
        description: 'ສາມາດເພີ່ມ ຫຼື ແກ້ໄຂຂໍ້ມຼນຜູ້ໃຊ້ໄດ້',
      },
      {
        id: 3,
        name: `${PermissionGroup.User}:${PermissionName.Remove}`,
        group_name: PermissionGroup.User,
        description: 'ສາມາດລຶບຂໍ້ມູນຜູ້ໃຊ້ໃນລະບົບໄດ້',
      },

      {
        id: 4,
        name: `${PermissionGroup.Registration}:${PermissionName.Read}`,
        group_name: PermissionGroup.Registration,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນຄົນລົງທະບຽນເຂົ້າເມືອງໄດ້',
      },
      {
        id: 5,
        name: `${PermissionGroup.Registration}:${PermissionName.Write}`,
        group_name: PermissionGroup.Registration,
        description: 'ສາມາດກວດສອບແລະຢືນຢັນລະຫັດເຂົ້າ / ອອກ ເມືອງໄດ້',
      },

      {
        id: 6,
        name: `${PermissionGroup.Banner}:${PermissionName.Read}`,
        group_name: PermissionGroup.Banner,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນປ້າຍສະແດງຢູ່ໜ້າ Home ແລະ Popup ໄດ້',
      },
      {
        id: 7,
        name: `${PermissionGroup.Banner}:${PermissionName.Write}`,
        group_name: PermissionGroup.Banner,
        description:
          'ສາມາດເພີ່ມ ຫຼື ແກ້ໄຂຂໍ້ມູນປ້າຍສະແດງຢູ່ໜ້າ Home ແລະ Popup ໄດ້',
      },
      {
        id: 8,
        name: `${PermissionGroup.Banner}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Banner,
        description: 'ສາມາດລຶບຂໍ້ມູນປ້າຍສະແດງຢູ່ໜ້າ Home ແລະ Popup ໄດ້',
      },

      {
        id: 9,
        name: `${PermissionGroup.Feedback}:${PermissionName.Read}`,
        group_name: PermissionGroup.Feedback,
        description: 'ສາມາດເບິ່ງຄຳຕິຊົມໄດ້',
      },
      {
        id: 10,
        name: `${PermissionGroup.Feedback}:${PermissionName.Write}`,
        group_name: PermissionGroup.Feedback,
        description: 'ສາມາດປ່ຽນສະຖານະຄຳຕິຊົມໄດ້',
      },
      {
        id: 11,
        name: `${PermissionGroup.Feedback}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Feedback,
        description: 'ສາມາດລຶບຄຳຕິຊົມໄດ້',
      },

      {
        id: 12,
        name: `${PermissionGroup.AccommodationRequest}:${PermissionName.Read}`,
        group_name: PermissionGroup.AccommodationRequest,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກໄດ້',
      },
      {
        id: 13,
        name: `${PermissionGroup.AccommodationRequest}:${PermissionName.Write}`,
        group_name: PermissionGroup.AccommodationRequest,
        description: 'ສາມາດເພີ່ມ ຫຼື ແກ້ໄຂຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກໄດ້',
      },
      {
        id: 14,
        name: `${PermissionGroup.AccommodationRequest}:${PermissionName.Remove}`,
        group_name: PermissionGroup.AccommodationRequest,
        description: 'ສາມາດລຶບຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກໄດ້',
      },

      {
        id: 15,
        name: `${PermissionGroup.Hotel}:${PermissionName.Read}`,
        group_name: PermissionGroup.Hotel,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນໂຮງແຮມໄດ້',
      },
      {
        id: 16,
        name: `${PermissionGroup.Hotel}:${PermissionName.Write}`,
        group_name: PermissionGroup.Hotel,
        description: 'ສາມາດເພີ່ມ ຫຼື ແກ້ໄຂຂໍ້ມູນໂຮງແຮມໄດ້',
      },
      {
        id: 17,
        name: `${PermissionGroup.Hotel}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Hotel,
        description: 'ສາມາດລຶບຂໍ້ມູນໂຮງແຮມໄດ້',
      },

      {
        id: 18,
        name: `${PermissionGroup.News}:${PermissionName.Read}`,
        group_name: PermissionGroup.News,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນຂ່າວສານໄດ້',
      },
      {
        id: 19,
        name: `${PermissionGroup.News}:${PermissionName.Write}`,
        group_name: PermissionGroup.News,
        description: 'ສາມາດເພີ່ມ ຫຼື ແກ້ໄຂຂໍ້ມູນຂ່າວສານໄດ້',
      },
      {
        id: 20,
        name: `${PermissionGroup.News}:${PermissionName.Remove}`,
        group_name: PermissionGroup.News,
        description: 'ສາມາດລຶບຂໍ້ມູນຂ່າວສານໄດ້',
      },

      {
        id: 21,
        name: `${PermissionGroup.Visa}:${PermissionName.Read}`,
        group_name: PermissionGroup.Visa,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນປະເພດ visa ໄດ້',
      },
      {
        id: 22,
        name: `${PermissionGroup.Visa}:${PermissionName.Write}`,
        group_name: PermissionGroup.Visa,
        description: 'ສາມາດເພີ່ມ ຫຼື ແກ້ໄຂຂໍ້ມູນປະເພດ visa ໄດ້',
      },
      {
        id: 23,
        name: `${PermissionGroup.Visa}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Visa,
        description: 'ສາມາດລຶບຂໍ້ມູນປະເພດ visa ໄດ້',
      },

      {
        id: 24,
        name: `${PermissionGroup.Law}:${PermissionName.Read}`,
        group_name: PermissionGroup.Law,
        description: 'ສາມາດເບິ່ງເອກະສານກົດໝາຍໄດ້',
      },
      {
        id: 25,
        name: `${PermissionGroup.Law}:${PermissionName.Write}`,
        group_name: PermissionGroup.Law,
        description: 'ສາມາດເພີ່ມ ຫຼື ແກ້ໄຂເອກະສານກົດໝາຍໄດ້',
      },
      {
        id: 26,
        name: `${PermissionGroup.Law}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Law,
        description: 'ສາມາດລຶບເອກະສານກົດໝາຍໄດ້',
      },

      {
        id: 27,
        name: `${PermissionGroup.Checkpoint}:${PermissionName.Read}`,
        group_name: PermissionGroup.Checkpoint,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນດ່ານໄດ້',
      },
      {
        id: 28,
        name: `${PermissionGroup.Checkpoint}:${PermissionName.Write}`,
        group_name: PermissionGroup.Checkpoint,
        description: 'ສາມາດເພີ່ມ ຫຼື ແກ້ໄຂຂໍ້ມູນດ່ານໄດ້',
      },
      {
        id: 29,
        name: `${PermissionGroup.Checkpoint}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Checkpoint,
        description: 'ສາມາດລຶບຂໍ້ມູນດ່ານໄດ້',
      },

      {
        id: 30,
        name: `${PermissionGroup.Contact}:${PermissionName.Read}`,
        group_name: PermissionGroup.Contact,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນການຕິດຕໍ່ໄດ້',
      },
      {
        id: 31,
        name: `${PermissionGroup.Contact}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Contact,
        description: 'ສາມາດລຶບຂໍ້ມູນການຕິດຕໍ່ໄດ້',
      },

      {
        id: 32,
        name: `${PermissionGroup.Country}:${PermissionName.Read}`,
        group_name: PermissionGroup.Country,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນປະເທດໄດ້',
      },
      {
        id: 33,
        name: `${PermissionGroup.Country}:${PermissionName.Write}`,
        group_name: PermissionGroup.Country,
        description: 'ສາມາດເພີ່ມ ຫຼື ແກ້ໄຂຂໍ້ມູນປະເທດໄດ້',
      },
      {
        id: 34,
        name: `${PermissionGroup.Country}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Country,
        description: 'ສາມາດລຶບຂໍ້ມູນປະເທດໄດ້',
      },
    ]);
  }
};
