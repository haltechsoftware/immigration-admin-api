import { count } from 'drizzle-orm';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { permissions } from 'src/modules/users/entities';
import { db } from '../main';

export default async () => {
  const total = await db.select({ value: count() }).from(permissions);

  if (total[0].value < 36) {
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
        description: 'ສາມາດລຶບຂໍ້ມຼນຜູ້ໃຊ້ໃນລະບົບໄດ້',
      },

      {
        id: 4,
        name: `${PermissionGroup.Registration}:${PermissionName.Read}`,
        group_name: PermissionGroup.Registration,
        description: 'ສາມາດເບິ່ງຂໍ້ມຼນຄົນລົງທະບຽນເຂົ້າເມືອງໄດ້',
      },

      {
        id: 5,
        name: `${PermissionGroup.Banner}:${PermissionName.Read}`,
        group_name: PermissionGroup.Banner,
        description: 'ສາມາດເບິ່ງຂໍ້ມຼນປ້າຍສະແດງຢູ່ໜ້າ Home ແລະ Popup ໄດ້',
      },
      {
        id: 6,
        name: `${PermissionGroup.Banner}:${PermissionName.Write}`,
        group_name: PermissionGroup.Banner,
        description:
          'ສາມາດเพี่ม ຫຼື ແກ້ໄຂຂໍ້ມຼນປ້າຍສະແດງຢູ່ໜ້າ Home ແລະ Popup ໄດ້',
      },
      {
        id: 7,
        name: `${PermissionGroup.Banner}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Banner,
        description: 'ສາມາດลຶบຂໍ້ມຼນປ້າຍສະແດງຢູ່ໜ້າ Home ແລະ Popup ໄດ້',
      },

      {
        id: 8,
        name: `${PermissionGroup.File}:${PermissionName.Read}`,
        group_name: PermissionGroup.File,
        description: 'ສາມາດເບິ່ງ file ແລະ directory ສຳລັບ editor ໄດ້',
      },
      {
        id: 9,
        name: `${PermissionGroup.File}:${PermissionName.Write}`,
        group_name: PermissionGroup.File,
        description: 'ສາມາດเพี่ม ຫຼື ແກ້ໄຂ file ແລະ directory ສຳລັບ editor ໄດ້',
      },
      {
        id: 10,
        name: `${PermissionGroup.File}:${PermissionName.Remove}`,
        group_name: PermissionGroup.File,
        description: 'ສາມາດลຶบ file ແລະ directory ສຳລັບ editor ໄດ້',
      },

      {
        id: 11,
        name: `${PermissionGroup.Feedback}:${PermissionName.Read}`,
        group_name: PermissionGroup.Feedback,
        description: 'ສາມາດເບິ່ງຄຳຕິຊົມໄດ້',
      },
      {
        id: 12,
        name: `${PermissionGroup.Feedback}:${PermissionName.Write}`,
        group_name: PermissionGroup.Feedback,
        description: 'ສາມາດປ່ຽນສະຖານະຄຳຕິຊົມໄດ້',
      },
      {
        id: 13,
        name: `${PermissionGroup.Feedback}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Feedback,
        description: 'ສາມາດลຶบຄຳຕິຊົມໄດ້',
      },

      {
        id: 14,
        name: `${PermissionGroup.AccommodationRequest}:${PermissionName.Read}`,
        group_name: PermissionGroup.AccommodationRequest,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກໄດ້',
      },
      {
        id: 15,
        name: `${PermissionGroup.AccommodationRequest}:${PermissionName.Write}`,
        group_name: PermissionGroup.AccommodationRequest,
        description: 'ສາມາດเพี่ม ຫຼື ແກ້ໄຂຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກໄດ້',
      },
      {
        id: 16,
        name: `${PermissionGroup.AccommodationRequest}:${PermissionName.Remove}`,
        group_name: PermissionGroup.AccommodationRequest,
        description: 'ສາມາດลຶบຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກໄດ້',
      },

      {
        id: 17,
        name: `${PermissionGroup.Hotel}:${PermissionName.Read}`,
        group_name: PermissionGroup.Hotel,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນໂຮງແຮມໄດ້',
      },
      {
        id: 18,
        name: `${PermissionGroup.Hotel}:${PermissionName.Write}`,
        group_name: PermissionGroup.Hotel,
        description: 'ສາມາດเพี่ม ຫຼື ແກ້ໄຂຂໍ້ມູນໂຮງແຮມໄດ້',
      },
      {
        id: 19,
        name: `${PermissionGroup.Hotel}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Hotel,
        description: 'ສາມາດลຶบຂໍ້ມູນໂຮງແຮມໄດ້',
      },

      {
        id: 20,
        name: `${PermissionGroup.Hotel}:${PermissionName.Read}`,
        group_name: PermissionGroup.Hotel,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນໂຮງແຮມໄດ້',
      },
      {
        id: 21,
        name: `${PermissionGroup.Hotel}:${PermissionName.Write}`,
        group_name: PermissionGroup.Hotel,
        description: 'ສາມາດเพี่ม ຫຼື ແກ້ໄຂຂໍ້ມູນໂຮງແຮມໄດ້',
      },
      {
        id: 22,
        name: `${PermissionGroup.Hotel}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Hotel,
        description: 'ສາມາດลຶบຂໍ້ມູນໂຮງແຮມໄດ້',
      },

      {
        id: 23,
        name: `${PermissionGroup.News}:${PermissionName.Read}`,
        group_name: PermissionGroup.News,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນຂ່າວສານໄດ້',
      },
      {
        id: 24,
        name: `${PermissionGroup.News}:${PermissionName.Write}`,
        group_name: PermissionGroup.News,
        description: 'ສາມາດเพี่ม ຫຼື ແກ້ໄຂຂໍ້ມູນຂ່າວສານໄດ້',
      },
      {
        id: 25,
        name: `${PermissionGroup.News}:${PermissionName.Remove}`,
        group_name: PermissionGroup.News,
        description: 'ສາມາດลຶบຂໍ້ມູນຂ່າວສານໄດ້',
      },

      {
        id: 26,
        name: `${PermissionGroup.Visa}:${PermissionName.Read}`,
        group_name: PermissionGroup.Visa,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນປະເພດ visa ໄດ້',
      },
      {
        id: 27,
        name: `${PermissionGroup.Visa}:${PermissionName.Write}`,
        group_name: PermissionGroup.Visa,
        description: 'ສາມາດเพี่ม ຫຼື ແກ້ໄຂຂໍ້ມູນປະເພດ visa ໄດ້',
      },
      {
        id: 28,
        name: `${PermissionGroup.Visa}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Visa,
        description: 'ສາມາດลຶบຂໍ້ມູນປະເພດ visa ໄດ້',
      },

      {
        id: 29,
        name: `${PermissionGroup.Law}:${PermissionName.Read}`,
        group_name: PermissionGroup.Law,
        description: 'ສາມາດເບິ່ງເອກະສານກົດໝາຍໄດ້',
      },
      {
        id: 30,
        name: `${PermissionGroup.Law}:${PermissionName.Write}`,
        group_name: PermissionGroup.Law,
        description: 'ສາມາດเพี่ม ຫຼື ແກ້ໄຂເອກະສານກົດໝາຍໄດ້',
      },
      {
        id: 31,
        name: `${PermissionGroup.Law}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Law,
        description: 'ສາມາດลຶบເອກະສານກົດໝາຍໄດ້',
      },

      {
        id: 32,
        name: `${PermissionGroup.Checkpoint}:${PermissionName.Read}`,
        group_name: PermissionGroup.Checkpoint,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນດ່ານໄດ້',
      },
      {
        id: 33,
        name: `${PermissionGroup.Checkpoint}:${PermissionName.Write}`,
        group_name: PermissionGroup.Checkpoint,
        description: 'ສາມາດเพี่ม ຫຼື ແກ້ໄຂຂໍ້ມູນດ່ານໄດ້',
      },
      {
        id: 34,
        name: `${PermissionGroup.Checkpoint}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Checkpoint,
        description: 'ສາມາດลຶบຂໍ້ມູນດ່ານໄດ້',
      },

      {
        id: 35,
        name: `${PermissionGroup.Contact}:${PermissionName.Read}`,
        group_name: PermissionGroup.Contact,
        description: 'ສາມາດເບິ່ງຂໍ້ມູນການຕິດຕໍ່ຫາໄດ້',
      },
      {
        id: 36,
        name: `${PermissionGroup.Contact}:${PermissionName.Remove}`,
        group_name: PermissionGroup.Contact,
        description: 'ສາມາດลຶบຂໍ້ມູນການຕິດຕໍ່ຫາໄດ້',
      },
    ]);
  }
};
